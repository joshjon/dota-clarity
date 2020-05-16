# Dota Clarity Backend

This project contains source code and supporting files for the serverless application Dota Clarity.

It is built using the [AWS Serverless Application Model](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) (AWS SAM) and consists of several AWS resources, including DynamoDB, Lambda functions and an API Gateway API. SAM automates the provisioning of these resources by using the infrastructure model defined in `template.yaml` to create the Dota Clarity AWS CloudFormation stack.

## Table of Contents

- [Infrastructure](#Infrastructure)
- [Prerequisites](#Prerequisites)
- [Deploy Dota Clarity to AWS](#Deploy-Dota-Clarity-to-AWS)
- [Cleanup AWS CloudFormation stack](#Cleanup-AWS-CloudFormation-stack)
- [Local development and testing](#Local-development-and-testing)

## Infrastructure

### CloudFormation

CloudFormation provides a common method to model and provision AWS resources in an automated and secure manner. All of Dota Clarity's AWS resources are defined using the YAML programming language in `template.yaml`. This file is then interpreted by CloudFormation to create the entire application stack, and ultimately acts as the app's single source of truth.

The resources in the Dota Clarity application stack are outlined below.

### CloudFront

Content Delivery Network (CDN) to deliver the Dota Clarity website. Serves content through a worldwide network of data centers called Edge Locations. Content is cached and served at these Edge Locations to provide content closer to where viewers are located and improve perfomance.

### S3 Bucket

Hosts the static web content and client side scripts for the Dota Clarity website.

### Cognito User Pool

Provides authentication, authorization, and user management for Dota Clarity. Allows users to register and sign in with an email and password.

### DynamoDB

#### dota-clarity-matches-table

Stores all matches favourited by Dota Clarity users.

Key schema:

| Name     | Type    | Key type | Description                          |
| :------- | :------ | :------- | :----------------------------------- |
| id       | string  | hash     | cognito id of a dota clarity account |
| match_id | integer | range    | id of a verified dota match          |

### Lambda Functions

#### dota-clarity-get-match

Gets the `match_id` parameter from the event, makes a request to the OpenDota API to retrieve the match data, transforms the data to align with Dota Clarity's expected match schema, and returns the match.

#### dota-clarity-get-all-matches

Gets the `steam_id` parameter from the event, makes a request to the OpenDota API to retrieve all match data for the given Steam ID, transforms the data to align with Dota Clarity's expected match schema, and returns all matches.

#### dota-clarity-create-favourite-match

Loads the match body received in the event, validates the data, and inserts the record into `dota-clarity-matches-table`.

#### dota-clarity-get-favourite-match

Gets the `id` and `match_id` parameters from the event, queries `dota-clarity-matches-table` using the parameters, and returns the match.

#### dota-clarity-get-favourite-matches

Gets the `id` parameter from the event, queries `dota-clarity-matches-table` for all favourite matches with the same ID, and returns the list of matches.

### API Gateway

Dota Clarity REST API to expose the application's match data. It is authenticated using Amazon Cognito User Pools with every request requiring an access token. Resources and methods are linked to the Lambda functions above.

Documentation of the API can be found here: [Dota Clarity REST API Resources](/docs/README.md).

## Prerequisites

SAM CLI is used to build and deploy the application and requires the following tools to be installed.

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Python 3](https://www.python.org/downloads/)
- [Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

## Deploy Dota Clarity to AWS

### 1. Build and deploy the backend

Dota Clarity uses the Serverless Application Model Command Line Interface (SAM CLI) for building and deploying the application. To build and deploy the application, run the following commands in your shell:

```bash
sam build
sam deploy
```

_Note: if you would like to change the deployment configuration then use `sam deploy --guided`._

### 2. Configure and deploy the client

When the backend deployment completes your terminal will print the outputs of the stack. Copy the values of the following outputs and paste them into `client/js/config.js`

- `CognitoUserPoolId`
- `CognitoUserPoolClientId`
- `ApiGatewayUrl`

Finally, deploy the client to S3 using the `BucketName` output value.

```bash
aws s3 cp website s3://<BucketName value> --recursive --acl public-read
```

You can now view the website by visiting the CloudFront URL found under the `WebsitePublicUrl` output e.g. d1zx0ql70u7omk.cloudfront.net.

## Cleanup AWS CloudFormation stack

To delete the Dota Clarity application that you have deployed, use the AWS CLI:

```bash
aws cloudformation delete-stack --stack-name dota-clarity
```

## Local development and testing

### Setup local environment

#### Ensure all pre-requisites are installed before continuing

In order to test the Dota Clarity API locally we need to setup the following.

- Docker network
- DynamoDB Docker image
- Local DynamoDB tables

Setup the local environment by running `setup-local.sh`. You can simply press 'q' when the DynamoDB table previews appear.

```bash
./setup-local.sh
```

SAM uses Docker to emulate the application's API and run functions in an Amazon Linux environment that matches Lambda.
Build the application and locally start the Dota Clarity API.

```bash
sam build
sam local start-api --parameter-overrides ParameterKey=Environment,ParameterValue=local --docker-network dota-clarity
```

### Making requests to the local Dota Clarity API

Example payloads are provided in the `/payloads` directory and are used in POST requests below.

#### Get match

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/5392211187
```

#### Get all matches

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/players/68726794
```

#### Create favourite match

```bash
curl -X POST -H "Content-Type: application/json" -d @payloads/create-match.json http://localhost:3000/matches/favourites/4ae52f50
```

#### Get favourite match

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/favourites/4ae52f50/5392211187
```

#### Get all favourite matches

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/matches/favourites/4ae52f50
```

#### Scan table

You can also perform a scan on the local DynamoDB table to list all items.

```bash
aws dynamodb scan --table-name dota-clarity-matches-table --endpoint-url http://localhost:8000
```

### Cleanup local environment

Cleanup the Docker container, Docker network, and DynamoDB tables by running `cleanup-local.sh`:

```bash
./cleanup-local.sh
```
