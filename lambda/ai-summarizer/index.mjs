import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const yields = body.yields;

        if (!yields || !Array.isArray(yields) || yields.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid yield data provided" }),
            };
        }

        const modelId = process.env.MODEL_ID;

        const prompt = `
    Analyze the following U.S. Treasury yield curve data:
    ${JSON.stringify(yields, null, 2)}

    Provide a JSON response with the following fields:
    1. "marketCondition": One of "normal", "inverted", "flat", or "steep".
    2. "summary": A concise paragraph (2-3 sentences) summarizing the current state of the yield curve and what it implies for the economy.
    3. "keyInsights": An array of 3 short, bullet-point style insights.

    Do not include any markdown formatting or explanations outside the JSON.
    `;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Extract content from Claude's response
        const contentText = responseBody.content[0].text;

        // Parse the JSON from the text (handle potential markdown blocks if Claude adds them despite instructions)
        let jsonResponse;
        try {
            const jsonMatch = contentText.match(/\{[\s\S]*\}/);
            jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(contentText);
        } catch (e) {
            console.error("Failed to parse JSON from model response:", contentText);
            throw new Error("Invalid response format from AI model");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                ...jsonResponse,
                generatedAt: new Date().toISOString()
            }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
