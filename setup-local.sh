#!/bin/bash

echo "Creating Dota Clarity Docker network..."

docker network create dota-clarity

echo "Creating local DynamoDB Docker image..."

docker run --network dota-clarity --name dynamodb -d -p 8000:8000 amazon/dynamodb-local

echo "Wating for network..."
sleep 1

echo "Creating 'profiles' local DynamoDB table"

aws dynamodb create-table \
    --table-name dota-clarity-profiles \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
--provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
--endpoint-url \
    http://localhost:8000 

echo "Creating 'matches' local DynamoDB table"
aws dynamodb create-table \
    --table-name dota-clarity-matches \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=matchid,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=matchid,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
--endpoint-url \
    http://localhost:8000
