#!/bin/bash

echo "Creating Dota Clarity Docker network..."

docker network create dota-clarity

echo "Creating local DynamoDB Docker image..."

docker run --network dota-clarity --name dynamodb -d -p 8000:8000 amazon/dynamodb-local

echo "Wating for network..."
sleep 1

echo "Creating local DynamoDB table 'dota-clarity-matches-table'"
aws dynamodb create-table \
    --table-name dota-clarity-matches-table \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=match_id,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=match_id,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
--endpoint-url \
    http://localhost:8000
