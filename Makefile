.PHONY : typechain compile test compile-clean console run prettier integration

typechain:
	./node_modules/.bin/typechain --target ethers-v5 --outDir typechain './artifacts/*.json'

compile:
	npx hardhat compile
	cp -R artifacts/** app/src/build
	make typechain

compile-clean:
	npx hardhat clean
	rm -r ./typechain/*
	make compile

test:
	npm run-script test

run-node:
	@npx hardhat node

e2e:
	npx hardhat run integration/EndToEndStream.ts

integration:
	npx hardhat run integration/MultipleRecipientIntegration.ts

1inch:
	npx hardhat --network localhost run integration/1inchIntegration.ts

aave:
	npx hardhat --network localhost run integration/aaveIntegration.ts

prettier:
	npm run prettier

commit:
	git add .
	git commit -m "quick commit"
	git push

mock-live:
	ganache-cli --fork http://localhost:8545 -p 8546 --unlock 0x6b175474e89094c44da98b954eedeac495271d0f, 0x9eb7f2591ed42dee9315b6e2aaf21ba85ea69f8c
