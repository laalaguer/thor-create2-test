// Web3
const Web3 = require('web3')
const rpcURL = "http://localhost:8545"
const web3 = new Web3(rpcURL)

// Local constants
const values = require('./constants.js')

// Local helpers
const helpers = require('./helpers.js')

// Build Tx object.
async function newTxObject(callerAddress, bytecode){
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
    let txObject = await newTxObject(creatorAddress,factoryBytecode)
    let tx = await web3.eth.sendTransaction(txObject)
    let receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
    let factoryAddress = receipt.contractAddress
    return factoryAddress
}

// Deploy "examer.sol" contract.
// return examer address.
async function deployExamerContract(creatorAddress, examerBytecode){
    let txObject = await newTxObject(creatorAddress, examerBytecode)
    let tx = await web3.eth.sendTransaction(txObject)
    let receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
    let contractAddr = receipt.contractAddress
    return contractAddr
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
    // Due to <thor: runtime.go>
    // It will generate another log of contract creation before the event we emitted. 
    // So we need to decode receipt.logs[1] rather than receipt.logs[0]
    /**
     * OnCreateContract: func(_ *vm.EVM, contractAddr, caller common.Address) {
			// set master for created contract
			rt.state.SetMaster(thor.Address(contractAddr), thor.Address(caller))

			data, err := prototypeSetMasterEvent.Encode(caller)
			if err != nil {
				panic(err)
			}

			stateDB.AddLog(&types.Log{
				Address: common.Address(contractAddr),
				Topics:  []common.Hash{common.Hash(prototypeSetMasterEvent.ID())},
				Data:    data,
			})
		},
     */
    let decoded = web3.eth.abi.decodeLog(eventType, receipt.logs[1].data, receipt.logs[1].topics)
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

// Interact with examer.sol contract.
// Ask the examer contract which is deployed at contractAddr, 
// that the extcodehash of inspectedAddr.
async function getExtCodeHash(contractAddr, contractAbi, inspectedAddr) {
    const examerContract = new web3.eth.Contract(contractAbi, contractAddr)
    let codehash = await examerContract.methods.detect(inspectedAddr).call()
    return codehash
}

// Run the test.
async function runTest(){
    // Test on the CREATE2 opcode.
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

    // Test on EXTHASHCODE opcode.
    let examerAddress = await deployExamerContract(values.creatorAddress, values.examerBytecode)
    console.log("examer.sol deployed at:\t\t\t\t", examerAddress)

    let creatorCodeHash = await getExtCodeHash(examerAddress, values.examerAbi, values.creatorAddress)
    console.log("creator extcodehash:\t\t\t\t", creatorCodeHash)

    let userCodeHash = await getExtCodeHash(examerAddress, values.examerAbi, values.userAddress)
    console.log("user extcodehash:\t\t\t\t", userCodeHash)

    let noneExistCodeHash = await getExtCodeHash(examerAddress, values.examerAbi, values.noneExistAddress)
    console.log("non-exit extcodehash:\t\t\t\t", noneExistCodeHash)

    let accountContractCodeHash = await getExtCodeHash(examerAddress, values.examerAbi, accountContractAddress)
    console.log("account.sol extcodehash:\t\t\t", accountContractCodeHash)
}

runTest().then(res => {console.log("test finished.")})