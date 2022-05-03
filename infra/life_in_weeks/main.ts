import { Construct } from "constructs";
import { App, S3Backend, TerraformStack } from "cdktf";
import { AwsProvider, dynamodb } from "@cdktf/provider-aws";
import {
  DEFAULT_REGION,
  getEndpoints,
  isTestEnv,
  NEXT_AUTH_DYNAMODB_TABLE,
  TERRAFORM_BUCKET,
  TERRAFORM_DYNAMODB_TABLE,
} from "../definitions";
class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const myEndpoints = getEndpoints();

    if (!isTestEnv) {
      new S3Backend(this, {
        bucket: TERRAFORM_BUCKET,
        region: process.env.AWS_REGION ?? DEFAULT_REGION,
        key: "terraform.tfstate",
        dynamodbTable: TERRAFORM_DYNAMODB_TABLE,
      });
    }

    new AwsProvider(this, "aws", {
      region: process.env.AWS_REGION ?? DEFAULT_REGION,
      endpoints: myEndpoints,
      skipCredentialsValidation: isTestEnv,
    });

    new dynamodb.DynamodbTable(this, `NextAuthTable`, {
      name: NEXT_AUTH_DYNAMODB_TABLE,
      hashKey: "pk",
      rangeKey: "sk",
      ttl: { enabled: true, attributeName: "expires" },
      readCapacity: 1,
      writeCapacity: 1,
      globalSecondaryIndex: [
        {
          name: "GSI1",
          hashKey: "GSI1PK",
          rangeKey: "GSI1SK",
          projectionType: "ALL",
          readCapacity: 1,
          writeCapacity: 1,
        },
      ],
      attribute: [
        {
          name: "pk",
          type: "S",
        },
        {
          name: "sk",
          type: "S",
        },
        {
          name: "GSI1PK",
          type: "S",
        },
        {
          name: "GSI1SK",
          type: "S",
        },
      ],
    });
  }
}

const app = new App();
new MyStack(app, "life_in_weeks");
app.synth();
