import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "MemoryCardPairs";

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    let category, level;

    console.log('Event keys:', Object.keys(event));
    console.log('queryStringParameters:', event.queryStringParameters);
    console.log('pathParameters:', event.pathParameters);
    console.log('body:', event.body);

    // Check various possible locations for the parameters
    if (event.queryStringParameters) {
      ({ category, level } = event.queryStringParameters);
    } else if (event.pathParameters) {
      ({ category, level } = event.pathParameters);
    } else if (event.body) {
      const body = JSON.parse(event.body);
      ({ category, level } = body);
    } else {
      ({ category, level } = event);
    }

    console.log('Extracted parameters:', { category, level });

    if (!category || !level) {
      const errorDetails = {
        queryStringParameters: event.queryStringParameters,
        pathParameters: event.pathParameters,
        eventKeys: Object.keys(event),
        body: event.body,
      };
      const errorMessage = `Missing required parameters: category and level. Details: ${JSON.stringify(errorDetails, null, 2)}`;
      throw new Error(errorMessage);

      //throw new Error('Missing required parameters: category and level');
    }

    const pairsCount = getLevelPairsCount(level);

    let command;
    if (category.toLowerCase() === 'all') {
      command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: pairsCount
      });
    } else {
      command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category
        },
        Limit: pairsCount
      });
    }

    console.log('Executing DynamoDB command:', JSON.stringify(command, null, 2));
    const response = await docClient.send(command);
    console.log('DynamoDB response:', JSON.stringify(response, null, 2));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify(response.Items)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
        event: JSON.stringify(event)
      })
    };
  }
};

function getLevelPairsCount(level) {
  switch(level) {
    case 'Easy': return 8;  // 4x4
    case 'Medium': return 12; // 5x5 (rounded down)
    case 'Hard': return 18; // 6x6
    case 'Extremely Hard': return 32; // 8x8
    default: return 8;
  }
}