const { expect, use } = require('chai');
const { ethers, waffle } = require('hardhat');
const { awaitWrapNZapAddress } = require('./utils');
const IWrappedETH = require('../artifacts/contracts/interfaces/IWrappedETH.sol/IWrappedETH.json');
const WrapNZap = require('../artifacts/contracts/WrapNZap.sol/WrapNZap.json');
const WrapNZapFactory = require('../artifacts/contracts/WrapNZapFactory.sol/WrapNZapFactory.json');

const { deployMockContract } = waffle;

describe('WrapNZapFactory', function () {
	let WrapNZapFactoryFactory;
	let wrapNZapFactory;
	let mockWrappedToken;
	let owner;
	let addr1;
	let addr2;
	let addr3;
	let addrs;

	beforeEach(async function () {
		[owner, addr1, addr1, addr2, ...addrs] = await ethers.getSigners();

		mockWrappedToken = await deployMockContract(owner, IWrappedETH.abi);

		WrapNZapFactoryFactory = await ethers.getContractFactory(
			'WrapNZapFactory'
		);
		wrapNZapFactory = await WrapNZapFactoryFactory.deploy();
		await wrapNZapFactory.deployed();
	});

	it('deploys with instance count = 0 via create()', async function () {
		const zapCount = await wrapNZapFactory.wrapnzapCount();
		expect(zapCount).to.equal(0);
	});

	describe('WrapNZapFactory.create()', function () {
		let receipt;
		let wrapNZapAddress;
		let wrapNZap;
		let zap;
		let zapCount;

		beforeEach(async function () {
			receipt = await wrapNZapFactory.create(
				addr1.address,
				mockWrappedToken.address
			);
			wrapNZapAddress = await awaitWrapNZapAddress(await receipt.wait());
			wrapNZap = await ethers.getContractFactory('WrapNZap');
			zap = await wrapNZap.attach(wrapNZapAddress);
			zapCount = await wrapNZapFactory.wrapnzapCount();
		});
		it('creates new zap with correct data', async function () {
			expect(receipt)
				.to.emit(wrapNZapFactory, 'NewWrapNZap')
				.withArgs(
					addr1.address,
					mockWrappedToken.address,
					wrapNZapAddress
				);

			expect(await zap.zappee()).to.equal(addr1.address);
			expect(await zap.wrapper()).to.equal(mockWrappedToken.address);

			expect(zapCount).to.equal(1);
		});

		it('creates new zaps with correct data when called multiple times', async function () {
			const receipt2 = await wrapNZapFactory.create(
				addr2.address,
				mockWrappedToken.address
			);
			const wrapNZapAddress2 = await awaitWrapNZapAddress(
				await receipt2.wait()
			);

			const zap2 = await wrapNZap.attach(wrapNZapAddress2);
			const zapCount2 = await wrapNZapFactory.wrapnzapCount();

			expect(receipt2)
				.to.emit(wrapNZapFactory, 'NewWrapNZap')
				.withArgs(
					addr2.address,
					mockWrappedToken.address,
					wrapNZapAddress2
				);

			expect(await zap.zappee()).to.equal(addr1.address);
			expect(await zap.wrapper()).to.equal(mockWrappedToken.address);
			expect(await zap2.zappee()).to.equal(addr2.address);
			expect(await zap2.wrapper()).to.equal(mockWrappedToken.address);
			expect(zapCount).to.equal(1);
			expect(zapCount2).to.equal(2);
		});
	});

	describe('WrapNZapFactory.createAndZap()', function () {
		let receipt;
		let wrapNZapAddress;
		let wrapNZap;
		let zap;
		let zapCount;

		beforeEach(async function () {
			receipt = await wrapNZapFactory.createAndZap(
				addr1.address,
				mockWrappedToken.address
			);
			wrapNZapAddress = await awaitWrapNZapAddress(await receipt.wait());
			wrapNZap = await ethers.getContractFactory('WrapNZap');
			zap = await wrapNZap.attach(wrapNZapAddress);
			zapCount = await wrapNZapFactory.wrapnzapCount();
		});

		it('creates new zap with correct data', async function () {
			expect(await zap.zappee()).to.equal(addr1.address);
			expect(await zap.wrapper()).to.equal(mockWrappedToken.address);
			expect(zapCount).to.equal(1);
		});

		it('creates new zaps with correct data when called multiple times', async function () {
			const receipt2 = await wrapNZapFactory.createAndZap(
				addr2.address,
				mockWrappedToken.address
			);
			const wrapNZapAddress2 = await awaitWrapNZapAddress(
				await receipt2.wait()
			);

			const zap2 = await wrapNZap.attach(wrapNZapAddress2);
			const zapCount2 = await wrapNZapFactory.wrapnzapCount();

			expect(receipt2)
				.to.emit(wrapNZapFactory, 'NewWrapNZap')
				.withArgs(
					addr2.address,
					mockWrappedToken.address,
					wrapNZapAddress2
				);

			expect(await zap.zappee()).to.equal(addr1.address);
			expect(await zap.wrapper()).to.equal(mockWrappedToken.address);
			expect(await zap2.zappee()).to.equal(addr2.address);
			expect(await zap2.wrapper()).to.equal(mockWrappedToken.address);
			expect(zapCount).to.equal(1);
			expect(zapCount2).to.equal(2);
		});

		// it('zaps to zappee', async function () {
		// 	zap;
		// });
	});
});
