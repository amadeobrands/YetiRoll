.PHONY : typechain compile test

typechain:
	./node_modules/.bin/typechain --target ethers-v5 --outDir typechain './artifacts/*.json'

compile:
	npx buidler compile
	cp -R artifacts/** app/src/build

compile-clean:
	npx buidler clean
	make compile

test:
	npm run-script test