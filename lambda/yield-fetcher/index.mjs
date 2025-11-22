import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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

        const yields = [];

        // Fetch data for each series
        for (const [label, seriesId] of Object.entries(SERIES_IDS)) {
            try {
                const response = await axios.get(
                    `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`
                );

                const observations = response.data.observations;
                if (observations && observations.length > 0) {
                    const value = parseFloat(observations[0].value);
                    if (!isNaN(value)) {
                        yields.push({
                            maturity: label,
                            yield: value,
                            seriesId: seriesId
                        });
                    }
                }
            } catch (err) {
                console.error(`Failed to fetch ${label} (${seriesId}):`, err.message);
            }
        }

        if (yields.length === 0) {
            throw new Error("No yield data fetched");
        }

        // Sort yields by maturity duration for consistent ordering
        const maturityOrder = ["1 Mo", "3 Mo", "6 Mo", "1 Yr", "2 Yr", "5 Yr", "10 Yr", "20 Yr", "30 Yr"];
        yields.sort((a, b) => maturityOrder.indexOf(a.maturity) - maturityOrder.indexOf(b.maturity));

        const item = {
            date: today,
            type: "yield_curve",
            yields: yields,
            updatedAt: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: tableName,
            Item: item
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ message: "Yield data updated successfully", data: item }),
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
