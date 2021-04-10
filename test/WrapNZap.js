const { expect, use } = require('chai');
const { providers } = require('ethers');
const { ethers, waffle } = require('hardhat');
const IWrappedETH = require('../artifacts/contracts/interfaces/IWrappedETH.sol/IWrappedETH.json');
const WrapNZap = require('../artifacts/contracts/WrapNZap.sol/WrapNZap.json');

const { deployMockContract } = waffle;

describe('WrapNZap', function () {
	let WrapNZapFactory;
	let wrapNZap;
	let mockWrappedToken;
	let owner;
	let zappee;
	let addr1;
	let addr2;
	let addrs;

	beforeEach(async function () {
		[owner, zappee, addr1, addr2, ...addrs] = await ethers.getSigners();

		mockWrappedToken = await deployMockContract(owner, IWrappedETH.abi);

		WrapNZapFactory = await ethers.getContractFactory('WrapNZap');
		wrapNZap = await WrapNZapFactory.deploy(
			zappee.address,
			mockWrappedToken.address
		);
		await wrapNZap.deployed();
	});

	it('deploys with correct data', async function () {
		expect(await wrapNZap.zappee()).to.equal(zappee.address);
		expect(await wrapNZap.wrapper()).to.equal(mockWrappedToken.address);
	});

	it('reverts if wrapped token transfer failed', async function () {
		await mockWrappedToken.mock.deposit.returns();
		await mockWrappedToken.mock.transfer.returns(false);

		const receipt = addr1.sendTransaction({
			to: wrapNZap.address,
			value: 200,
		});

		await expect(receipt).to.be.revertedWith('WrapNZap: transfer failed');
	});

	it('correctly changes ETH balances', async function () {
		await mockWrappedToken.mock.deposit.returns();
		await mockWrappedToken.mock.transfer.returns(true);
		const receipt = await addr1.sendTransaction({
			to: wrapNZap.address,
			value: 200,
		});

		await expect(receipt).to.changeEtherBalances(
			[mockWrappedToken, addr1],
			[200, -200]
		);
	});
});
