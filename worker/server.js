require('dotenv').config()
const axios = require('axios')
const ethers = require('ethers')

// Temporarily keep track of transationHashes processed. WIP
const processedMap = new Map();

console.log(`[Start] Listening oracle with provider ${process.env.PROVIDER_RPC_URL} and address ${process.env.ORACLE_ADDRESS}`)

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_RPC_URL)
const oracleAddress = process.env.ORACLE_ADDRESS
const callbackAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "response",
                "type": "string"
            }
        ],
        "name": "onCallbackHTTPGet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const invokeUrlWithCallback = async ({ callbackAddress, url, responseKey }) => {
    console.log(`[API Request Started] Destination: ${callbackAddress} URL: ${url} Response Key: ${responseKey}`)
    const response = await axios.get(url)
    const data = response?.data
    const value = data[responseKey]
    console.log(`[API Response Received]] ${value}`)

    const relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider)
    const callbackContract = new ethers.Contract(callbackAddress, callbackAbi, relayerWallet)
    try {
        const callbackTransaction = await callbackContract.onCallbackHTTPGet(value)
        // console.log('Callback Transaction Complete')
        // console.log(callbackTransaction)
    } catch (e) {
        // console.log(e)
    } finally {
        console.log(`[API Request Ended]`)
    }
}

const fetch = async () => {
    const blockNumber = await provider.getBlockNumber()
    try {
        const data = await provider.getBlockWithTransactions(blockNumber-1)
        const transactions = data?.transactions
        const oracleTxs = transactions?.filter((tx) => {
            const oracle = oracleAddress.toLowerCase()
            const target = tx.to.toLowerCase()
            const dataContainsOracle = tx?.data?.includes(oracleAddress.toLowerCase().replace('0x', ''))
            const isMatch = target === oracle || dataContainsOracle
            // console.log(`New inbound transaction for ${target}, oracle address is ${oracle}, is match ${isMatch} or data contains oracle ref ${dataContainsOracle}`)
            // console.log(tx)
            return isMatch
        });
        // Oracle events?
        console.log(`[Scanning] Oracle transactions at block ${blockNumber-1} found: ${oracleTxs.length}`)
        if (oracleTxs.length > 0) {
            oracleTxs.forEach(async(tx) => {
                const receipt = await tx.wait()
                const events = receipt?.logs
                const transactionHash = receipt.transactionHash;
                if (processedMap.get(transactionHash)) {
                    // Do nothing
                    console.log(`[Received Event] Already processed txHash: ${transactionHash}, doing nothing`)
                } else {
                    // Mark as processed
                    processedMap.set(transactionHash, true)
                    const decodedData = ethers.utils.defaultAbiCoder.decode([ 'address', 'string', 'string' ], events[0].data)
                    /**
                     * e.g Event format
                     * [
                     *  '0x2265BfE8b1baBB71aeDa3A8e37af4015dF6B8f73',
                     *  'https://api.binance.com/api/v3/ticker/price?symbol=FILUSDT',
                     *  'price'
                     * ]
                     */
                    console.log(`[Received Event] processing txHash: ${transactionHash} with properties:`)
                    console.log(decodedData)
                    const value = await invokeUrlWithCallback({
                        callbackAddress: decodedData[0],
                        url: decodedData[1],
                        responseKey: decodedData[2]
                    })
                }
            })
        }
    } catch (e) {
        // Ignore for now
        // console.log(e)
    }
    fetch()
}

// Kickstart polling
fetch()