import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const yieldData = body.yield;

        if (!yieldData) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                },
                body: JSON.stringify({ error: "No yield data provided" }),
            };
        }

        // Mock news data (DuckDuckGo scraping is complex, using mock for now)
        const news = [
            {
                title: `${yieldData.maturity} Treasury Yields Signal Market Shift`,
                url: "https://www.example.com/news1",
                source: "Financial Times"
            },
            {
                title: `Bond Market Reacts to ${yieldData.maturity} Rate Changes`,
                url: "https://www.example.com/news2",
                source: "Bloomberg"
            },
            {
                title: `Investors Eye ${yieldData.maturity} Treasury Performance`,
                url: "https://www.example.com/news3",
                source: "Reuters"
            }
        ];

        // Generate AI summary
        const prompt = `Analyze the ${yieldData.maturity} U.S. Treasury yield currently at ${yieldData.yield}%.

Provide 4-5 bullet points covering:
1. What this yield level indicates about market sentiment
2. Historical context (is this high/low/normal)
3. Economic implications for this specific maturity
4. What investors should consider

Keep each point concise and actionable.`;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 800,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: process.env.MODEL_ID || "anthropic.claude-4-5-sonnet-20250220-v1:0",
            body: JSON.stringify(payload)
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const aiText = responseBody.content[0].text;

        // Parse bullet points from AI response
        const bulletPoints = aiText
            .split('\n')
            .filter(line => line.trim().length > 0 && line.trim().match(/^[\d\-\•\*]/))
            .map(line => line.replace(/^[\d\-\•\*\.\)]\s*/, '').trim())
            .filter(line => line.length > 0);
        
        // If no bullet points found, split by sentences
        const finalPoints = bulletPoints.length > 0 ? bulletPoints : aiText.split('.').filter(s => s.trim().length > 20).slice(0, 5);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({
                news: news,
                economicSummary: finalPoints.slice(0, 5),
                generatedAt: new Date().toISOString()
            }),
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
