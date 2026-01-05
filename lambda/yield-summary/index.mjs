import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import axios from "axios";

const REGION = "us-east-1";
const client = new BedrockRuntimeClient({ 
    region: REGION,
    requestHandler: { requestTimeout: 90000 }
});

export const handler = async (event) => {
    console.log("Using region:", REGION);
    console.log("Event:", JSON.stringify(event));
    try {
        const body = JSON.parse(event.body || "{}");
        console.log("Body:", JSON.stringify(body));
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

        // Fetch real news from Google News RSS
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        let news = [];
        let newsContext = '';
        
        try {
            const searchQuery = `treasury yield ${yieldData.maturity}`;
            const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
            const response = await axios.get(rssUrl, { timeout: 10000 });
            
            // Parse RSS XML to extract news items with descriptions
            const items = response.data.match(/<item>([\s\S]*?)<\/item>/g) || [];
            news = items.slice(0, 3).map(item => {
                const title = item.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/)?.[1] || 'News Article';
                const link = item.match(/<link>(.+?)<\/link>/)?.[1] || '#';
                const source = item.match(/<source[^>]*>(.+?)<\/source>/)?.[1] || 'News';
                const description = item.match(/<description><!\[CDATA\[(.+?)\]\]><\/description>/)?.[1]?.replace(/<[^>]*>/g, '').substring(0, 200) || 'Treasury yield market update';
                return { title, url: link, source, description };
            });
            
            // Create news context for AI
            newsContext = news.length > 0 
                ? `\n\nRecent news headlines about treasury yields:\n${news.map(n => `- ${n.title}`).join('\n')}`
                : '';
        } catch (err) {
            console.error('News fetch failed:', err.message);
            news = [
                { title: `${yieldData.maturity} Treasury Yield at ${yieldData.yield}%`, url: '#', source: 'Current Data', description: 'Current treasury yield data' }
            ];
        }

        // Generate AI summary with current date and news context
        const prompt = `Today is ${today}. Analyze the ${yieldData.maturity} U.S. Treasury yield currently at ${yieldData.yield}% as of today.${newsContext}

Provide exactly 5 complete bullet points. Each bullet point must be 2-3 sentences long and fully complete.

1. Current Market Sentiment: What this ${yieldData.yield}% yield level indicates about market sentiment today (reference news if relevant)
2. Historical Context: Is this high/low/normal compared to recent trends and historical averages
3. Economic Implications: Specific impacts on borrowing costs, housing, corporate debt, and the broader economy for this maturity
4. Investor Considerations: What investors should consider given today's rate and current news
5. Portfolio Action: Specific actionable recommendations for investors

Ensure each point is complete with full sentences. Do not cut off mid-sentence.`;

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
            modelId: process.env.MODEL_ID || "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
            body: JSON.stringify(payload)
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        console.log("Bedrock response:", JSON.stringify(responseBody));
        const aiText = responseBody.content[0].text;
        console.log("AI Text:", aiText);

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
        console.error("Error stack:", error.stack);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message, stack: error.stack }),
        };
    }
};
