test-env: 
	bash -c "trap 'make clean' EXIT && \
	SERVICES=dynamodb,sts localstack start -d && \
	cdktf deploy --auto-approve && \
	DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin"

clean:
	localstack stop

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