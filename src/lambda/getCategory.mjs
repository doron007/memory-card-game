import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Example: Fetching categories
    const command = new ScanCommand({
      TableName: "MemoryCardPairs",
      ProjectionExpression: "category",
    });

    console.log('Executing DynamoDB Scan command');
    const response = await docClient.send(command);
    console.log('DynamoDB response:', JSON.stringify(response, null, 2));

    const categories = [...new Set(response.Items.map(item => item.category))];
    console.log('Extracted categories:', categories);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(categories)
    };
  } catch (error) {
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack
      })
    };
  }
};