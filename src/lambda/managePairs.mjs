import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({});

const BUCKET_NAME = "memory-card-game-images"; // Replace this with your actual S3 bucket name
const TABLE_NAME = "MemoryCardPairs"; // Replace with your actual DynamoDB table name if different

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    if (!event.body) {
      throw new Error('Event body is undefined');
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Error parsing event body:', event.body);
      throw new Error(`Invalid JSON in event body: ${parseError.message}`);
    }

    console.log('Parsed body:', JSON.stringify(parsedBody, null, 2));

    const { operation, pairID, category, image1, image2 } = parsedBody;

    if (!operation) {
      throw new Error('Operation is missing in the request body');
    }

    switch (operation) {
      case 'CREATE':
        return await createPair(pairID, category, image1, image2);
      case 'READ':
        return await readPair(pairID, category);
      case 'UPDATE':
        return await updatePair(pairID, category, image1, image2);
      case 'DELETE':
        return await deletePair(pairID, category);
      default:
        throw new Error('Invalid operation');
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({ 
        error: 'Bad Request',
        details: error.message,
        stack: error.stack
      })
    };
  }
};

async function createPair(pairID, category, image1, image2) {
  const image1Url = await uploadImage(image1, `${pairID}_1`);
  const image2Url = await uploadImage(image2, `${pairID}_2`);

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      pairID,
      category,
      image1: image1Url,
      image2: image2Url
    }
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify({ message: 'Pair created successfully' })
  };
}

async function readPair(pairID, category) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pairID,
      category
    }
  });

  const response = await docClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify(response.Item)
  };
}

async function updatePair(pairID, category, image1, image2) {
  const image1Url = await uploadImage(image1, `${pairID}_1`);
  const image2Url = await uploadImage(image2, `${pairID}_2`);

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      pairID,
      category
    },
    UpdateExpression: 'set image1 = :i1, image2 = :i2',
    ExpressionAttributeValues: {
      ':i1': image1Url,
      ':i2': image2Url
    },
    ReturnValues: 'UPDATED_NEW'
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify({ message: 'Pair updated successfully' })
  };
}

async function deletePair(pairID, category) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pairID,
      category
    }
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify({ message: 'Pair deleted successfully' })
  };
}

async function uploadImage(base64Image, fileName) {
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: 'image/jpeg'
  });

  const response = await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}