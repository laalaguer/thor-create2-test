// Web3
const Web3 = require('web3')
const rpcURL = "http://localhost:8545"
const web3 = new Web3(rpcURL)

// Local constants
const values = require('./constants.js')

// Local helpers
const helpers = require('./helpers.js')

// Build Tx object.
async function newfactoryTxObject(callerAddress, bytecode){
    let nonceCount = await web3.eth.getTransactionCount(callerAddress)
    
    const txObject = {
        from: callerAddress,
        // to: nope, we don't have a destination.
        // value: nope, we don't send value to destination.
        nonce: web3.utils.toHex(nonceCount),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: bytecode // data: the bytecode of contract to be deployed.
    }

    return txObject
}

// Deploy "factory.sol" contract.
// return factory address.
async function deployFactoryContract(creatorAddress, factoryBytecode){
    let txObject = await newfactoryTxObject(creatorAddress,factoryBytecode)
    let tx = await web3.eth.sendTransaction(txObject)
    let receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
    let factoryAddress = receipt.contractAddress
    return factoryAddress
}

// return 'data' of the transaction.
function deployAccountContractFunctionCall(factoryAddress, factoryAbi, forWhomAddress){
    const accountContractBytecode = values.accountBytecode
    const paramsEncoded = web3.eth.abi.encodeParameter('address', forWhomAddress)
    const bytecode = `${accountContractBytecode}${paramsEncoded.slice(2)}`
    
    const salt_int = 1
    const salt = web3.utils.toHex(salt_int)

    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress)
    const factoryContractFunction = factoryContract.methods.deploy(bytecode, salt) // Here you can call your contract functions
    return factoryContractFunction.encodeABI()
}

// Build Tx object
async function newAccountContractTxObject(callerAddress, calleeAddress, data){
    let nonceCount = await web3.eth.getTransactionCount(callerAddress)
    
    const txObject = {
        from: callerAddress,
        to: calleeAddress, // call the contract
        data: data, // call the function
        nonce: web3.utils.toHex(nonceCount), // caller nonce
        gasLimit: web3.utils.toHex(4500000), // many gas!
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')), // average gas price
    }

    return txObject
}

async function deployAccountContractViaFactory(callerAddress, factoryAddress, forWhomAddress){
    let data = deployAccountContractFunctionCall(factoryAddress, values.factoryAbi, forWhomAddress)
    let txObject = await newAccountContractTxObject(callerAddress, factoryAddress, data)
    // The factory "Deployed" Event interface.
    const eventType = [
        {
            "indexed": false,
            "name": "addr",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "salt",
            "type": "uint256"
        }
    ]

    let tx = await web3.eth.sendTransaction(txObject)
    let receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
    let decoded = web3.eth.abi.decodeLog(eventType, receipt.logs[0].data, receipt.logs[0].topics)
    return decoded['0'] // account contract address
}

// return 'data' of the transaction.
function buildCustomCreate2Address(factoryAddress, forWhomAddress){
    const accountContractBytecode = values.accountBytecode
    const paramsEncoded = web3.eth.abi.encodeParameter('address', forWhomAddress)
    const bytecode = `${accountContractBytecode}${paramsEncoded.slice(2)}`
    
    const salt_int = 1
    const salt = helpers.numberToUint256(salt_int) // important! shall be 64 length in ASCII or 32 bytes.

    const predictedAddress = helpers.buildCreate2Address(factoryAddress, salt, bytecode)

    return predictedAddress
}

// Interact with account.sol contract.
async function getOwner(accountContractAddress, accountContractAbi){
    const accountContract = new web3.eth.Contract(accountContractAbi, accountContractAddress)
    let currentOwner = await accountContract.methods.owner().call()
    return currentOwner
}

// Interact with account.sol contract.
async function setOwner(accountContractAddress, accountContractAbi, callerAddress, newOwnerAddress){
    const accountContract = new web3.eth.Contract(accountContractAbi, accountContractAddress)
    await accountContract.methods.setOwner(newOwnerAddress).send({from: callerAddress})
}

// Run the test.
async function runTest(){
    let factoryAddress = await deployFactoryContract(values.creatorAddress, values.factoryBytecode)
    console.log("factory.sol deployed at:\t\t\t", factoryAddress)
    // Creator deploy a "account.sol" contract for user.
    let accountContractAddress = await deployAccountContractViaFactory(values.creatorAddress, factoryAddress, values.userAddress)
    console.log("account.sol deployed at:\t\t\t", accountContractAddress)
    // Predict an address offline.
    let predictedAddress = buildCustomCreate2Address(factoryAddress, values.userAddress)
    console.log("predicted address:\t\t\t\t", predictedAddress)
    // See if match
    console.log("predicted address matches actual address?\t", predictedAddress.toLowerCase()==accountContractAddress.toLowerCase())
    // Check the account contract ownership.
    let ownerAddress = await getOwner(accountContractAddress, values.accountAbi)
    console.log("current acccount.sol contract owner:\t\t", ownerAddress)
    // See if match
    console.log("owner matches?\t\t\t\t\t", values.userAddress == ownerAddress)
    // Change the ownership
    console.log("set new owner to:\t\t\t\t", values.bystanderAddress)
    await setOwner(accountContractAddress, values.accountAbi, values.userAddress, values.bystanderAddress)
    let newOwnerAddress = await getOwner(accountContractAddress, values.accountAbi)
    console.log("current acccount.sol contract owner:\t\t", newOwnerAddress)
    console.log("new owner matches?\t\t\t\t", values.bystanderAddress.toLowerCase() === newOwnerAddress.toLowerCase())
}

runTest().then(res => {console.log("test finished.")})