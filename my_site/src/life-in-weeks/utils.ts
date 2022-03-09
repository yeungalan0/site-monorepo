import {
  DynamoDB,
  DynamoDBClientConfig,
  CreateTableCommandInput,
  DeleteTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { Adapter } from "next-auth/adapters";
import { TEST_ENV } from "./definitions";

const dynamoConfig =
  process.env.ENVIRONMENT == TEST_ENV
    ? {
        accessKeyId: "foo",
        secretAccessKey: "foo",
        region: "us-west-2",
        endpoint: "http://localhost:4566",
      }
    : {
        accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
        region: process.env.NEXT_AUTH_AWS_REGION ?? "us-west-2",
        endpoint: undefined,
      };

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: dynamoConfig.accessKeyId,
    secretAccessKey: dynamoConfig.secretAccessKey,
  },
  region: dynamoConfig.region,
  endpoint: dynamoConfig.endpoint,
};

const dynamoDB = new DynamoDB(config);

const dynamoClient = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const dynamoAdapter: Adapter = DynamoDBAdapter(dynamoClient);

// Date validation from taken from https://stackoverflow.com/a/62517465/5910564
export function isValidDate(s: string): boolean {
  // Assumes s is "mm/dd/yyyy" or "m/dd/yyyy"
  if (!/^\d?\d\/\d?\d\/\d\d\d\d$/.test(s)) {
    console.log(`Pattern not found for: ${s}`);
    return false;
  }
  const parts = s.split("/").map((p) => parseInt(p, 10));
  parts[0] -= 1;
  const d = new Date(parts[2], parts[0], parts[1]);
  return (
    d.getMonth() === parts[0] &&
    d.getDate() === parts[1] &&
    d.getFullYear() === parts[2]
  );
}

// Test functions
async function createNextAuthTable() {
  const params: CreateTableCommandInput = {
    TableName: "next-auth",
    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" },
      { AttributeName: "sk", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "GSI1PK", AttributeType: "S" },
      { AttributeName: "GSI1SK", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI1",
        KeySchema: [
          { AttributeName: "GSI1PK", KeyType: "HASH" },
          { AttributeName: "GSI1SK", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
      },
    ],
  };
  return dynamoDB.createTable(params);
}

async function deleteNextAuthTable() {
  const params: DeleteTableCommandInput = {
    TableName: "next-auth",
  };
  return dynamoDB.deleteTable(params);
}

export async function resetNextAuthTable(): Promise<null> {
  try {
    await deleteNextAuthTable();
  } catch (e) {
    if (!(e instanceof Error) || e.name !== "ResourceNotFoundException") {
      throw e;
    }
  }
  await createNextAuthTable();
  return null;
}

export async function seedNextAuthTable(
  userObject: Record<string, string>
): Promise<null> {
  await dynamoAdapter.createUser({ ...userObject });
  return null;
}
