import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider, dynamodb } from "./.gen/providers/aws";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, "aws", {
      region: "us-east-1",
      endpoints: [
        {
          dynamodb:
            process.env.NEXT_AUTH_DYNAMO_ENDPOINT ?? "http://localhost:4566",
          sts: process.env.NEXT_AUTH_STS_ENDPOINT ?? "http://localhost:4566",
        },
      ],
    });

    new dynamodb.DynamodbTable(this, `NextAuthTable`, {
      name: "next-auth",
      hashKey: "pk",
      rangeKey: "sk",
      ttl: { enabled: true, attributeName: "expires" },
      readCapacity: 10, // TODO
      writeCapacity: 10,
      globalSecondaryIndex: [
        {
          name: "GSI1",
          hashKey: "GSI1PK",
          rangeKey: "GSI1SK",
          projectionType: "ALL",
          readCapacity: 10,
          writeCapacity: 10,
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
