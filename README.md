# Dota Clarity Backend

This project contains source code and supporting files for the serverless application Dota Clarity.

The application uses several AWS resources, including DynamoDB, Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project.

## Prerequisites
To use the SAM CLI, you need the following tools installed.
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
* [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Python 3](https://www.python.org/downloads/)
* [Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

## Deploy Dota Clarity to AWS

Dota Clarity uses the Serverless Application Model Command Line Interface (SAM CLI) for building and deploying the application. To build and deploy the application, run the following commands in your shell:

** NOTE: Check if --use-container is required for deploying to AWS **

```bash
sam build --use-container
sam deploy
```
Note: if you would like to change the deployment configuration then use `sam deploy --guided`.

You will then find the Dota Clarity API Gateway Endpoint URL in the output values displayed after deployment.

## Local development and testing

### Setup local environment

**Ensure all pre-requisites are installed before continuing** 

In order to test the Dota Clarity API locally we need to setup the following.
- Docker network
- DynamoDB Docker image
- Local DynamoDB tables

Setup the local environment by running the setup-local.sh shell script. You can simply press 'q' when the DynamoDB table previews appear.
```bash
./setup-local.sh
```

SAM uses Docker to emulate the application's API and run functions in an Amazon Linux environment that matches Lambda.
Build the application and locally start the Dota Clarity API.

```bash
sam build --use-container
sam local start-api --parameter-overrides ParameterKey=Environment,ParameterValue=local --docker-network dota-clarity
```


### Making requests to the local Dota Clarity API

Sample payloads are provided in the `/payloads` directory and are used in the requests below.

**Create profile**
```bash
curl -X POST -H "Content-Type: application/json" -d @payloads/create-profile.json http://localhost:3000/profiles
```

**Get profile**
```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/profiles/bestdotaplayer@dota.com
```

**Create match**
```bash
curl -X POST -H "Content-Type: application/json" -d @payloads/create-match.json http://localhost:3000/matches/bestdotaplayer@dota.com
```

**Get match**
```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/bestdotaplayer@dota.com/5392211187
```

**Get all matches**
```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/bestdotaplayer@dota.com
```

**Scan table**
You can also perform a scan on the local DynamoDB table to list all items.
```bash
aws dynamodb scan --table-name dota-clarity-profiles-table --endpoint-url http://localhost:3000
```

### Cleanup the local environment

Cleanup the Docker container, Docker network, and DynamoDB tables by runing the cleanup-local.sh shell script:
```bash
./cleanup-local.sh
```

## Cleanup the AWS stack

To delete the Dota Clarity application that you have deployed, use the AWS CLI: 

```bash
aws cloudformation delete-stack --stack-name dota-clarity
```