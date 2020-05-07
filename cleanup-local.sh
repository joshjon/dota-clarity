echo "Removing local DynamoDB Docker image..."
docker ps -a -q --filter=ancestor=amazon/dynamodb-local | xargs -I {} docker rm {} --force
echo "Removing Dota Clarity Docker network..."
docker network rm dota-clarity