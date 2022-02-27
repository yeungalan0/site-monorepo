test-env: 
	bash -c "trap 'make clean' EXIT; \
	SERVICES=dynamodb,sts localstack start -d; \
	cdktf deploy --auto-approve; \
	DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin"

clean:
	localstack stop

github-test-env:
	npm install
	$(npm bin)/cdktf deploy --auto-approve

install:
	pip install localstack
	npm install
	sudo npm install -g dynamodb-admin
	sudo npm install --global cdktf-cli@latest
	sudo dnf install -y dnf-plugins-core
	sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
	sudo dnf -y install terraform
	cdktf get