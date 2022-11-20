# Fireway

### Dockerize

First create the image from the Dockerfile
```
docker build . -t fireway/worker
```

Run the container passing the following env variables
```
docker run -d -e PROVIDER_RPC_URL=<EVM_RPC_URL> -e ORACLE_ADDRESS=<ORACLE_CONTRACT_ADDRESS> -e RELAYER_PRIVATE_KEY=<WALLET_PAYING_FOR_GAS> fireway/worker
```