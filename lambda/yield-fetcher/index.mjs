import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import axios from "axios";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const SERIES_IDS = {
    "1 Mo": "DGS1MO",
    "3 Mo": "DGS3MO",
    "6 Mo": "DGS6MO",
    "1 Yr": "DGS1",
    "2 Yr": "DGS2",
    "5 Yr": "DGS5",
    "10 Yr": "DGS10",
    "20 Yr": "DGS20",
    "30 Yr": "DGS30",
};

export const handler = async (event) => {
    try {
        const apiKey = process.env.FRED_API_KEY;
        const tableName = process.env.TABLE_NAME;
        const today = new Date().toISOString().split("T")[0];

        // 1. Check cache (DynamoDB)
        try {
            const getResponse = await docClient.send(new GetCommand({
                TableName: tableName,
                Key: { date: today, type: "daily_snapshot" }
            }));

            if (getResponse.Item) {
                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "POST, OPTIONS"
                    },
                    body: JSON.stringify({ message: "Data retrieved from cache", data: getResponse.Item }),
                };
            }
        } catch (err) {
            console.warn("Cache miss or error:", err.message);
        }

        // 2. Fetch from FRED (Cache miss)
        // Define all series to fetch
        const SERIES_CONFIG = {
            interest_rates: {
                "1 Mo": "DGS1MO",
                "3 Mo": "DGS3MO",
                "6 Mo": "DGS6MO",
                "1 Yr": "DGS1",
                "2 Yr": "DGS2",
                "5 Yr": "DGS5",
                "10 Yr": "DGS10",
                "20 Yr": "DGS20",
                "30 Yr": "DGS30",
            },
            economic_growth: {
                "GDP": "GDP",
                "Real GDP": "GDPC1"
            },
            inflation: {
                "CPI": "CPIAUCSL",
                "Core CPI": "CPILFESL"
            },
            employment: {
                "Unemployment Rate": "UNRATE",
                "Nonfarm Payrolls": "PAYEMS"
            },
            money_supply: {
                "M2": "M2SL"
            }
        };

        const snapshot = {
            date: new Date().toISOString().split("T")[0],
            categories: {},
            updatedAt: new Date().toISOString()
        };

        // Helper to fetch single series
        const fetchSeries = async (seriesId) => {
            try {
                const response = await axios.get(
                    `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`
                );
                const obs = response.data.observations;
                if (obs && obs.length > 0) {
                    const current = parseFloat(obs[0].value);
                    const previous = obs.length > 1 ? parseFloat(obs[1].value) : null;
                    return {
                        value: current,
                        date: obs[0].date,
                        change: previous !== null && !isNaN(previous) ? current - previous : 0
                    };
                }
            } catch (err) {
                console.error(`Failed to fetch ${seriesId}:`, err.message);
            }
            return null;
        };

        // Fetch Interest Rates (Yields)
        const yields = [];
        for (const [label, seriesId] of Object.entries(SERIES_CONFIG.interest_rates)) {
            const data = await fetchSeries(seriesId);
            if (data && !isNaN(data.value)) {
                yields.push({
                    maturity: label,
                    yield: data.value,
                    seriesId: seriesId,
                    change: data.change
                });
            }
        }

        // Sort yields
        const maturityOrder = ["1 Mo", "3 Mo", "6 Mo", "1 Yr", "2 Yr", "5 Yr", "10 Yr", "20 Yr", "30 Yr"];
        yields.sort((a, b) => maturityOrder.indexOf(a.maturity) - maturityOrder.indexOf(b.maturity));

        snapshot.categories.interest_rates = {
            id: "interest_rates",
            name: "Interest Rates",
            lastUpdated: new Date().toISOString(),
            yields: yields,
            primaryMetric: {
                label: "10-Year Treasury",
                value: yields.find(y => y.maturity === "10 Yr")?.yield || 0,
                change: yields.find(y => y.maturity === "10 Yr")?.change || 0,
                unit: "%"
            }
        };

        // Fetch Economic Growth (GDP)
        const gdpData = await fetchSeries(SERIES_CONFIG.economic_growth["Real GDP"]);
        if (gdpData) {
            snapshot.categories.economic_growth = {
                id: "economic_growth",
                name: "Economic Growth",
                lastUpdated: gdpData.date,
                primaryMetric: {
                    label: "Real GDP",
                    value: gdpData.value,
                    change: gdpData.change, // This is simplified, usually want % change
                    unit: "B$"
                }
            };
        }

        // Fetch Inflation (CPI)
        const cpiData = await fetchSeries(SERIES_CONFIG.inflation["CPI"]);
        if (cpiData) {
            snapshot.categories.inflation = {
                id: "inflation",
                name: "Inflation & Prices",
                lastUpdated: cpiData.date,
                primaryMetric: {
                    label: "CPI",
                    value: cpiData.value,
                    change: cpiData.change,
                    unit: "Index"
                }
            };
        }

        // Fetch Employment
        const unrateData = await fetchSeries(SERIES_CONFIG.employment["Unemployment Rate"]);
        if (unrateData) {
            snapshot.categories.employment = {
                id: "employment",
                name: "Employment",
                lastUpdated: unrateData.date,
                primaryMetric: {
                    label: "Unemployment Rate",
                    value: unrateData.value,
                    change: unrateData.change,
                    unit: "%"
                }
            };
        }

        // Fetch Money Supply
        const m2Data = await fetchSeries(SERIES_CONFIG.money_supply["M2"]);
        if (m2Data) {
            snapshot.categories.money_supply = {
                id: "money_supply",
                name: "Money Supply",
                lastUpdated: m2Data.date,
                primaryMetric: {
                    label: "M2 Money Supply",
                    value: m2Data.value,
                    change: m2Data.change,
                    unit: "B$"
                }
            };
        }

        // Store snapshot in DynamoDB
        await docClient.send(new PutCommand({
            TableName: tableName,
            Item: {
                date: snapshot.date,
                type: "daily_snapshot",
                ...snapshot
            }
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ message: "Snapshot updated successfully", data: snapshot }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
