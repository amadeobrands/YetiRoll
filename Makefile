
typechain:
	- ./node_modules/.bin/typechain --target ethers-v5 --outDir typechain 'artifacts/*.json'

compile:
	- npx buidler compile