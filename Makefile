.PHONY : typechain compile test

typechain:
	./node_modules/.bin/typechain --target ethers-v5 --outDir typechain './artifacts/*.json'

compile:
	npx buidler compile

compile-clean:
	npx buidler clean
	npx buidler compile

test:
	npm run-script test