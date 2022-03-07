const env = getEnv();
export const TERRAFORM_BUCKET = `yeungco-terraform-backend-${env}`;
export const TERRAFORM_DYNAMODB_TABLE = `terraform_state_${env}`;
export const TERRAFORM_USER = `terraform-user-${env}`;
export const DEFAULT_REGION = "us-west-2";
export const isTestEnv = env === "test";

function getEnv() {
  const myEnv = process.env.ENVIRONMENT;
  if (myEnv === "test" || myEnv === "dev" || myEnv == "prod") {
    return myEnv;
  } else {
    console.log(`ERROR: environment set to an unexpected value (${myEnv})`);
    process.exit(1);
  }
}

export function getEndpoints() {
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
    console.log("Using standard config...");
  }

  return myEndpoints;
}
