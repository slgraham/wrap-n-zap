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

### The need for poke

On the xDAI network, the xDAI bridge doesn't send an xDAI transaction when new DAI is bridged over from mainnet. Instead, it assigns the xDAI to the recipient via the coinbase/block reward, which does not trigger a contract's `receive()` or fallback function. Unfortunately, that breaks the end to end automation awesomeness of WrapNZap.

We can, however, get around this problem with a public `poke` function that triggers the contract's balance to be wrapped and zapped. It of course requires an additional transaction, but it need not be the original sender.

## WrapNZap Factory

This repo also includes a factory contract that simplifies the process for DAOs to deploy a WrapNZap contract of their own. A DAO -- or anybody working on behalf of the DAO -- can create a new WrapNZap instance with the DAO as the `zappee`.

Note: they will also need to set the `wrapper`.

## Current Deployments

### Mainnet

- WrapNZap Factory: [0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6](https://etherscan.io/address/0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6)

### xDAI Network

-   WrapNZap Factory: [0x8464135c8F25Da09e49BC8782676a84730C318bC](https://blockscout.com/poa/xdai/address/0x8464135c8F25Da09e49BC8782676a84730C318bC/contracts)

-   Raid Guild WrapNZap: [0x8398bCD4f633C72939F9043dB78c574A91C99c0A](https://blockscout.com/poa/xdai/address/0x8398bCD4f633C72939F9043dB78c574A91C99c0A/contracts)

### Rinkeby

-   WrapNZap Factory: [0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6](https://rinkeby.etherscan.io/address/0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6)

### Kovan

-   WrapNZap Factory: [0xbf9e327d465A4A160fA7805282Fb8C7aB892770a](https://kovan.etherscan.io/address/0xbf9e327d465A4A160fA7805282Fb8C7aB892770a)

### Polygon

-   WrapNZap Factory: [0xbf9e327d465A4A160fA7805282Fb8C7aB892770a](https://explorer-mainnet.maticvigil.com/address/0xbf9e327d465A4A160fA7805282Fb8C7aB892770a/)

## Running Tests

WrapNZap uses Hardhat, Waffle, and ethers. Here's how to test:

1. Clone this repo -- `git clone https://github.com/slgraham/wrap-n-zap.git`
2. Install hardhat and dependencies -- `yarn install`
3. Run tests -- `yarn hardhat test`
