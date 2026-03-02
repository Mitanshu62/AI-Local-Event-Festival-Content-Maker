import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const region = process.env.AWS_REGION;
const bedrockClient = new BedrockRuntimeClient({ region });
const dynamoClient = new DynamoDBClient({ region });
const s3Client = new S3Client({ region });

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { festival, language, tone, role, name, city } = body;

    const requestId = uuidv4();

    const prompt = `
You are an AI assistant that generates culturally accurate festival content.

Festival: ${festival}
Language: ${language}
Tone: ${tone}
Role: ${role}
Name: ${name}
City: ${city}

Generate:
1) A short WhatsApp-ready festival message
2) A 45-second role-based speech
3) Transliteration if applicable
    `;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_tokens: 800
      })
    });

    const response = await bedrockClient.send(command);
    const responseText = JSON.parse(Buffer.from(response.body).toString("utf-8")).completion;

    const s3Key = `outputs/${requestId}.txt`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: responseText
    }));

    await dynamoClient.send(new PutItemCommand({
      TableName: process.env.DYNAMO_TABLE,
      Item: {
        requestId: { S: requestId },
        festival: { S: festival },
        language: { S: language },
        timestamp: { S: new Date().toISOString() }
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Content generated successfully",
        requestId,
        s3Link: `https://${process.env.S3_BUCKET}.s3.${region}.amazonaws.com/${s3Key}`,
        output: responseText
      })
    };

  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
        details: err.message
      })
    };
  }
};