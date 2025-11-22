import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { search } from "duck-duck-scrape";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const tableName = process.env.TABLE_NAME;
        const today = new Date().toISOString().split("T")[0];

        console.log("Searching for US Treasury Yields News...");
        const searchResults = await search("US Treasury Yields News", {
            safeSearch: 1, // Moderate
            time: "d", // Past day
        });

        if (!searchResults.results || searchResults.results.length === 0) {
            console.log("No news found.");
            return { statusCode: 200, body: JSON.stringify({ message: "No news found" }) };
        }

        // Take top 5 results
        const topNews = searchResults.results.slice(0, 5).map(result => ({
            title: result.title,
            url: result.url,
            description: result.description,
            source: result.hostname || "Unknown"
        }));

        const item = {
            date: today,
            type: "news",
            newsItems: topNews,
            updatedAt: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: tableName,
            Item: item
        }));

        console.log(`Saved ${topNews.length} news items.`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "News updated successfully", count: topNews.length }),
        };
    } catch (error) {
        console.error("Error fetching news:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
