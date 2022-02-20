import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { Adapter } from "next-auth/adapters";

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: (process.env.NEXT_AUTH_AWS_ACCESS_KEY as string) ?? "foo",
    secretAccessKey: (process.env.NEXT_AUTH_AWS_SECRET_KEY as string) ?? "foo",
  },
  region: process.env.NEXT_AUTH_AWS_REGION,
  endpoint: "http://localhost:4566",
};

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
