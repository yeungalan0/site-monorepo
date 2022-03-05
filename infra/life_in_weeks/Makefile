test-env:
	bash -c "trap 'make clean' EXIT && \
	export ENVIRONMENT=TEST AWS_REGION=us-west-2 && \
	SERVICES=dynamodb,s3,sts,iam localstack start -d && \
	cdktf deploy --auto-approve && \
	DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin"

clean:
	localstack stop

# Note: Not using `cdktf deploy` here since I get a JSON error in github actions (perhaps some domain it talks to is blocked)
github-test-env:
	npm install
	npx cdktf synth
	cd cdktf.out/stacks/life_in_weeks && rm -rf .terraform && terraform init && terraform apply -auto-approve

install:
	pip install localstack
	npm install
	sudo npm install -g dynamodb-admin
	sudo npm install --global cdktf-cli@latest
	sudo dnf install -y dnf-plugins-core
	sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
	sudo dnf -y install terraform
	cdktf get
