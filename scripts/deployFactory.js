const { ethers } = require('hardhat');

const networkName = {
	42: 'Kovan',
	4: 'Rinkeby',
	100: 'xDai',
};

const networkCurrency = {
	42: 'ETH',
	4: 'ETH',
	100: 'xDai',
};

// async function main() {
// 	// We get the contract to deploy
// 	const WrapNZapFactory = await ethers.getContractFactory('WrapNZapFactory');
// 	const wrapNZapFactory = await WrapNZapFactory.deploy();

// 	console.log('WrapNZapFactory deployed to:', wrapNZapFactory.address);
// }

async function main() {
	const [deployer] = await ethers.getSigners();
	const address = await deployer.getAddress();
	const { chainId } = await deployer.provider.getNetwork();
	console.log('Deploying WrapNZapFactory on network:', networkName[chainId]);
	console.log('Account address:', address);
	console.log(
		'Account balance:',
		ethers.utils.formatEther(await deployer.provider.getBalance(address)),
		networkCurrency[chainId]
	);

	const factory = await ethers.getContractFactory('WrapNZapFactory');
	const wrapNZapFactory = await factory.deploy();

	await wrapNZapFactory.deployed();

	const txHash = wrapNZapFactory.deployTransaction.hash;
	const receipt = await deployer.provider.getTransactionReceipt(txHash);
	console.log('Transaction Hash:', txHash);
	console.log('Contract Address:', wrapNZapFactory.address);
	console.log('Block Number:', receipt.blockNumber);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
