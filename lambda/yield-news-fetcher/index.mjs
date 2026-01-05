import { XMLParser } from "fast-xml-parser";

export const handler = async (event) => {
    try {
        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                },
                body: ""
            };
        }

        const body = JSON.parse(event.body || "{}");
        const { maturity } = body;

        if (!maturity) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                },
                body: JSON.stringify({ error: "Maturity parameter is required" })
            };
        }

        const query = `${maturity} Treasury yield`;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

        console.log(`Fetching news for: ${query} from ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parser = new XMLParser();
        const feed = parser.parse(xmlText);

        // Handle case where channel or item might be missing or single item
        const channel = feed?.rss?.channel;
        let items = channel?.item || [];

        // fast-xml-parser might return a single object if there's only one item, so ensure array
        if (!Array.isArray(items)) {
            items = [items];
        }

        const news = items.slice(0, 3).map((item, index) => ({
            id: `${maturity}-${index}-${Date.now()}`,
            title: item.title,
            url: item.link,
            description: item.description || "",
            source: item.source || "Google News",
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        }));

        console.log(`Found ${news.length} news items for ${maturity}`);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ news })
        };
    } catch (error) {
        console.error("Error fetching yield news:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};
