[![Fireway](https://i.ibb.co/5RkSmDf/Screenshot-2022-11-19-171134.png)](https://fireway.xyz)

## Overview
Fireway is a cross-chain data oracle micro framework connecting real-world data and APIs to smart contracts. It greatly expands the capabilities of smart contracts by enabling access to real-world data and off-chain computation with a minimalistic yet scalable approach.

While building a smart storage market project within FEVM I realized the lack of options to interact with offchain datasources, not only on FEVM but on most EVM compatible networks. Working with Oracles is not mainstream and I just needed a quick way to access offchain data. This inspired me to build this project for the hackathon.

## Architecture
[![Fireway](https://i.ibb.co/fYk9QkJ/features-split-image-01.png)](https://fireway.xyz)

1. A smart contract client invokes the oracle smart contract `get` method passing `API URL` and `response key`
```
interface IOracleGateway {
    function get(string calldata url, string calldata responseKey) external;
}
```
2. The oracle smart contract emits an onchain `event`
```
  event OracleInvokeHTTPGet(address callback, string url, string responseKey);
```
3. Event is recorded in `Blockchain`
4. Worker polls data for a specific `Oracle Contract Address` and filters `Events`
5. Worker retrieves the `Event` parameters to execute API call
6. Worker parses API response call and retrieves the `responseKey` field
7. Worker calls `send_transaction`  to callback function on the contract from the address tagged as `sender` within the `event` with the value from the `responseKey`. An internal wallet relative to the worker, pre-funded with `FIL` supports programatically calling onchain events
```
function onCallbackHTTPGet(string calldata response)
``` 

## Features

- **Connect To Any API.** Retrieve data from any API, connect with existing systems, and integrate with any current or future blockchain.
- **Framework Approach.** Fireway approaches the oracle problem as a framework that others can extend to adapt to their needs.
- **Cross-chain.** Add offchain computing capabilities to any EVM compatible network and smart contract.
- **Minimalistic.** The oracle contract is less than 10 lines of code, yet it offers the flexibility to invoke any API.
- **Developer Friendly.** Launch a dockerized worker you control or integrate with an existing oracle instance.
- **Open Source.** Free to use, extend and collaborate. Checkout our Github and starting building.

## Tech

Fireway uses a number of projects to work properly:

- [ReactJS](https://reactjs.org/) - For the landing page
- [Remix IDE](https://reactjs.org/) - As Solidity smart contract IDE
- [EtherJS](https://reactjs.org/) - Markdown parser done right. Fast and easy to extend.
- [Docker](https://reactjs.org/) - great UI boilerplate for modern web apps
- [Filecoin EVM](https://reactjs.org/) - evented I/O for the backend

## Installation

I recommend you watch the tutorial video from the website. You will need minimum:
- A client contract that you want to integrate to offchain resources.
- An oracle contract deployed (could be yours or someone elses). For this, you can deploy an instance of the OracleGateway.sol
- A worker listening to the oracle contract (could be yours or someone elses). For this, follow the instructions below


First checkout this monorepo and create the Docker image from the Dockerfile from the `worker` folder
```
docker build . -t fireway/worker
```

Run the container passing the following env variables. Notice a wallet private key needs to be provided. This is a programatic wallet created for the worker and funded with FIL or the native token to support signing the callback functions to the smart contract. You need to create this wallet yourself and pass some native tokens from the faucet or live sources.
```
docker run -d -e PROVIDER_RPC_URL=<EVM_RPC_URL> -e ORACLE_ADDRESS=<ORACLE_CONTRACT_ADDRESS> -e RELAYER_PRIVATE_KEY=<WALLET_PAYING_FOR_GAS> fireway/worker
```

## Available Oracles

Currently for the hackathon the following Oracle Contracts are deployed and ready for public use

| Network | Contract Address |
| ------ | ------ |
| FEVM Wallaby Testnet | 0x6482C97f42099fb628067C1B699482b3ea950385 |

## Whats Next

We will see, a few things that are still hacky and need development
- Live Oracle and Workers Tracker
- Support for concurrent workers for the same oracle
- CLI
- Dedup for processing events from worker (event filter primitives were not working in Wallaby testnet at the time of this project)
- I can keep writing stuff here...



## License

MIT

**Free Software, Hell Yeah!**

