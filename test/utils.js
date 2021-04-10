// heavily borrowed from @dan13ram https://github.com/raid-guild/smart-invoice/blob/main/packages/contracts/test/utils.js

const { ethers, waffle } = require('hardhat');
const { expect } = require('chai');

module.exports.awaitWrapNZapAddress = async (receipt) => {
	if (!receipt || !receipt.logs) return '';
	const abi = new ethers.utils.Interface([
		'event NewWrapNZap(address zappee, address wrapper, address WrapNZap)',
	]);
	const eventFragment = abi.events[Object.keys(abi.events)[0]];
	const eventTopic = abi.getEventTopic(eventFragment);
	const event = receipt.logs.find((e) => e.topics[0] === eventTopic);
	if (event) {
		const decodedLog = abi.decodeEventLog(
			eventFragment,
			event.data,
			event.topics
		);
		return decodedLog.WrapNZap;
	}
	return '';
};
