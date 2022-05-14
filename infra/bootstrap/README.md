# Purpose

This is an initial Terraform bootstrap configuration to work around the
[Terraform chicken and egg problem when using the S3 backend.](https://mmatecki.medium.com/terraform-chicken-egg-problem-7504f8ddf2fc)

This project should deploy out the S3 bucket and DynamoDB table needed by
terraform to use the S3 backend, as well as an IAM user/credential with limited
permissions scopes that can be used by other IAC permissions scopes that can be
used by other IAC projects.

# Usage

**NOTE:** You should only need to run this once when setting up a new
environment where an S3 backend (and dynamo lock table) for Terraform does not
yet exist.

1. The below steps assume you already have an access key in the desired
   region/account with the necessary permissions (IAM, S3, and DynamoDB)
1. Cleanup any local runs
   ```
   rm -rf cdktf.out terraform.bootstrap.tfstate
   ```
1. Set the `AWS_PROFILE` environment variable to the AWS credentials profile you
   would like to deploy to and set `ENVIRONMENT` to the environment you're
   deploying to
1. Run the deployment command and ensure the plan looks correct

   ```
   cdktf deploy
   ```

   - Note: Multiple runs may be needed if you receive an error similar to the
     below. Seems like there's an asynchronous terraform bug.

     ```
     Error creating access key for user terraform-user-prod: NoSuchEntity: The user with name terraform-user-prod cannot be found.
     ```

1. Deploy out the changes if things look correct
1. Checkout the local `terraform.bootstrap.tfstate` file for generated IAM
   credentials
1. Store the credentials securely if they are needed later and delete the local
   state file
   ```
   rm -rf cdktf.out terraform.bootstrap.tfstate
   ```
