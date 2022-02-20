test-env: 
	bash -c "trap 'make clean' EXIT; \
	SERVICES=dynamodb,sts localstack start -d; \
	cdktf deploy --auto-approve; \
	DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin"

clean:
	localstack stop