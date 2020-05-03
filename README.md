# Dota Clarity Backend

This project contains source code and supporting files for the serverless application Dota Clarity.

The application uses several AWS resources, including DynamoDB, Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project.

## Deploy Dota Clarity to AWS

Dota Clarity uses the Serverless Application Model Command Line Interface (SAM CLI) for building and deploying the application. 

To use the SAM CLI, you need the following tools.
* AWS CLI - [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [and configure it with your security credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Python 3 - [Install Python 3](https://www.python.org/downloads/)
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy and build the application, run the following in your shell:

```bash
sam build --use-container
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Parameter Environment**: The environment you want to deploy to (aws or local)
* **Parameter TableName**: The name of the DynamoDB table.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Dota Clarity requires this permission to create AWS IAM roles required for the included AWS Lambda function(s) to access AWS services.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find the Dota Clarity API Gateway Endpoint URL in the output values displayed after deployment.

## Use the SAM CLI to build and test Dota Clarity API locally

### Setup local environment

First make sure you are in the root project directory.

SAM uses Docker to run your functions in an Amazon Linux environment that matches Lambda and emulate the application's API. Therefore, create a new Docker network that we can later attach the application to.

```bash
$ docker network create dota-clarity
$ docker run --network dota-clarity --name dynamodb -d -p 8000:8000 amazon/dynamodb-local
```

You can verify the network was created using:
```bash
$ docker network ls
```

Create a local DynamoDB table using the AWS CLI

```
$ aws dynamodb create-table --table-name dota-clarity-profiles --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000
```

You can verify the table was created using:

```
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

Build the application.

```bash
$ sam build --use-container
```

The SAM CLI installs dependencies defined in `dota_clarity/requirements.txt`, creates a deployment package, and saves it in the `.aws-sam/build` folder.


We can now emulate the Dota Clarity API using SAM to run the API locally on port 3000.

```bash
sam local start-api --parameter-overrides ParameterKey=Environment,ParameterValue=local ParameterKey=TableName,ParameterValue=dota-clarity-profiles --docker-network dota-clarity
```

### Making requests to the local Dota Clarity API

Sample payloads are profided in the `/payloads` directory and are used in the requests below.

**Create profile**
```
curl -X POST -H "Content-Type: application/json" -d @payloads/create-profile.json http://localhost:8000/profiles
```

**Get profile**
```
curl -X POST -H "Content-Type: application/json" -d @payloads/create-profile.json http://localhost:8000/profiles/<profile-id-here>
```

You can also perform a scan on the local DynamoDB table to list all the profiles it contains.

```
aws dynamodb scan --table-name dota-clarity-profiles --endpoint-url http://localhost:8000
```

### Cleanup the local environment

Delete the docker network:
TODO - Shouldnt need the command below.

Delete the the DynamoDB table
```
aws dynamodb delete-table --table-name dota-clarity-profiles --endpoint-url http://localhost:8000
```


## Cleanup

To delete the Dota Clarity application that you have deployed, use the AWS CLI: 

```bash
aws cloudformation delete-stack --stack-name dota-clarity
```