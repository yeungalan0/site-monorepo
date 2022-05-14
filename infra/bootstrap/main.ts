import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider, dynamodb, iam, s3 } from "@cdktf/provider-aws";
import {
  TERRAFORM_BUCKET,
  DEFAULT_REGION,
  TERRAFORM_DYNAMODB_TABLE,
  TERRAFORM_USER,
  getEndpoints,
  isTestEnv,
  NEXT_AUTH_DYNAMODB_TABLE,
} from "../definitions";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const myEndpoints = getEndpoints();

    // Needed to set s3ForcePathStyle to avoid this bug with localstack: https://github.com/localstack/localstack/issues/5566
    new AwsProvider(this, "aws", {
      region: process.env.AWS_REGION ?? DEFAULT_REGION,
      endpoints: myEndpoints,
      skipCredentialsValidation: isTestEnv,
      skipMetadataApiCheck: isTestEnv,
      skipRequestingAccountId: isTestEnv,
      s3ForcePathStyle: isTestEnv,
    });

    console.log(`Using bucket name: ${TERRAFORM_BUCKET}`);

    new s3.S3Bucket(this, "TerraformStateBucket", {
      bucket: TERRAFORM_BUCKET,
      serverSideEncryptionConfiguration: {
        rule: {
          applyServerSideEncryptionByDefault: {
            sseAlgorithm: "AES256",
          },
        },
      },
    });

    new dynamodb.DynamodbTable(this, "TerraformLockTable", {
      name: TERRAFORM_DYNAMODB_TABLE,
      hashKey: "LockID",
      attribute: [{ name: "LockID", type: "S" }],
      readCapacity: 5,
      writeCapacity: 5,
    });

    new iam.IamUser(this, "TerraformUser", {
      name: TERRAFORM_USER,
    });

    new iam.IamUserPolicy(this, "TerraformUserPolicy", {
      user: TERRAFORM_USER,
      policy: `{ \
  "Version": "2012-10-17", \
  "Statement": [ \
    { \
      "Effect": "Allow", \
      "Action": "s3:ListBucket", \
      "Resource": "arn:aws:s3:::${TERRAFORM_BUCKET}" \
    }, \
    { \
      "Effect": "Allow", \
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"], \
      "Resource": "arn:aws:s3:::${TERRAFORM_BUCKET}/*" \
    }, \
    { \
      "Effect": "Allow", \
      "Action": [ \
        "dynamodb:GetItem", \
        "dynamodb:PutItem", \
        "dynamodb:DeleteItem" \
      ], \
      "Resource": "arn:aws:dynamodb:*:*:table/${TERRAFORM_DYNAMODB_TABLE}" \
    }, \
    { \
      "Effect": "Allow", \
      "Action": [ \
        "dynamodb:*" \
      ], \
      "Resource": ["arn:aws:dynamodb:*:*:table/${NEXT_AUTH_DYNAMODB_TABLE}", \
                   "arn:aws:dynamodb:*:*:table/${NEXT_AUTH_DYNAMODB_TABLE}/*"] \
    } \
  ] \
}`,
    });

    new iam.IamAccessKey(this, "TerraformAccessKey", {
      user: TERRAFORM_USER,
    });
  }
}

const app = new App();
new MyStack(app, "bootstrap");
app.synth();
