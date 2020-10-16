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
	npm run-script test test/StreamManagerTest.ts

run-node:
	@npx buidler node

deploy:
	npx buidler run deployMigrate.ts

integration:
	npx buidler run integration/MultipleRecipientIntegration.ts

prettier:
	npm run prettier

commit:
	git add .
	git commit -m "quick commit"
	git push

mock-live:
	ganache-cli --fork http://localhost:8545 -p 8546 --unlock 0x6b175474e89094c44da98b954eedeac495271d0f, 0x9eb7f2591ed42dee9315b6e2aaf21ba85ea69f8c
