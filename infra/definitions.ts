const env = process.env.ENVIRONMENT?.toLowerCase();
export const TERRAFORM_BUCKET = `terraform-backend-${env}`;
export const TERRAFORM_DYNAMODB_TABLE = `terraform_state_${env}`;
export const TERRAFORM_USER = `terraform-user-${env}`;
export const DEFAULT_REGION = "us-west-2";

export function getEndpoints(isTestEnv: boolean) {
  let myEndpoints = undefined;
  if (isTestEnv) {
    console.log("Using test config...");
    myEndpoints = [
      {
        dynamodb: process.env.DYNAMO_ENDPOINT ?? "http://localhost:4566",
        s3: process.env.S3_ENDPOINT ?? "http://localhost:4566",
        sts: process.env.STS_ENDPOINT ?? "http://localhost:4566",
        iam: process.env.IAM_ENDPOINT ?? "http://localhost:4566",
      },
    ];
  } else {
    console.log("Using PROD config...");
  }

  return myEndpoints;
}
