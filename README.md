# WrapNZap

A simple zap contract to wrap a native token and send it to a destination.

## Overview & Motivation

Some contracts -- such as Moloch DAOs -- cannot receive or deal with native coins such as ETH (on mainnet) or xDAI (on xDAI network). To be sent to such contracts, native coins must first be wrapped into ERC20 tokens. This creates a UX challenge for users trying to get coins into those contracts from other networks.

For example, consider a user trying to send DAI to a Moloch DAO on the xDAI network. Currently, they must do the following:

### Current Process (before WrapNZap)

1. Bridge their DAI from mainnet to the xDAI network. They'll receive xDAI (remember, not an ERC20 token) at their wallet address on the xDAI network.
2. Wrap the xDAI into Wrapped xDAI (wxDAI) -- e.g. using a tool like [WrapETH](https://wrapeth.com)
3. Transfer the wxDAI to the DAO

### With WrapNZap

WrapNZap simplifies this process into a single step.

1. Use the [xDAI bridge](https://bridge.xdaichain.com/) and specify the DAO's WrapNZap contract as the receipient. The WrapNZap contract handles the wrapping and the zapping to the DAO.

## How it works

Each instance of a WrapNZap contract specifies two key items:

-   `wrapper` -- the address of the wrapped native token contract (e.g. wxDAI)
-   `zappee` -- the address where the wrapped tokens will be sent/zapped (e.g. a Moloch DAO's bank).

WrapNZap leverages solidity's `receive()` capability to trigger activity when the network's native coin is sent to it.

When this happens, the native coins are first sent to the `wrapper` to be wrapped into an ERC20 token, and then the resulting tokens are transferred to the `zappee`.

## WrapNZap Factory

This repo also includes a factory contract that simplifies the process for DAOs to deploy a WrapNZap contract of their own. A DAO -- or anybody working on behalf of the DAO -- can create a new WrapNZap instance with the DAO as the `zappee`.

Note: they will also need to set the `wrapper`.

## Current Deployments

### xDAI Network

WrapNZap Factory: [0x5FC8d32690cc91D4c39d9d3abcBD16989F875707](https://blockscout.com/poa/xdai/address/0x5FC8d32690cc91D4c39d9d3abcBD16989F875707/contracts)

Raid Guild WrapNZap: [0x61c36a8d610163660e21a8b7359e1cac0c9133e1](https://blockscout.com/poa/xdai/address/0x61c36a8d610163660E21a8b7359e1Cac0C9133e1/contracts)

## Running Tests

WrapNZap uses Hardhat, Waffle, and ethers. Here's how to test:

1. Clone this repo -- `git clone https://github.com/slgraham/wrap-n-zap.git`
2. Install hardhat and dependencies -- `yarn install`
3. Run tests -- `yarn hardhat test`
