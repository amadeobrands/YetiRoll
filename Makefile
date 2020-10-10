.PHONY : typechain compile test compile-clean console run deploy prettier integration

typechain:
	./node_modules/.bin/typechain --target ethers-v5 --outDir typechain './artifacts/*.json'

compile:
	npx buidler compile
	cp -R artifacts/** app/src/build
	make typechain

compile-clean:
	npx buidler clean
	rm -r ./typechain/*
	make compile

test:
	npm run-script test

run-node:
	@npx buidler node

deploy:
	npx buidler run deployMigrate.ts

integration:
	npx buidler run integration/MultipleRecipientIntegration.ts

prettier:
	npm run prettier
