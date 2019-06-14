const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')

function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  // let b = web3.utils.sha3(byteCode)
  let a = `0x${[
    'ff',
    creatorAddress,
    saltHex,
    web3.utils.sha3(byteCode)
  ].map(x => x.replace(/0x/, ''))
  .join('')}`
  return `0x${web3.utils.sha3(a).slice(-40)}`.toLowerCase()
}

// converts an int to uint256
function numberToUint256(value) {
  const hex = value.toString(16)
  return `0x${'0'.repeat(64-hex.length)}${hex}`
}

// encodes parameter to pass as contract argument
function encodeParam(dataType, data) {
  return web3.eth.abi.encodeParameter(dataType, data)
}

// returns true if contract is deployed on-chain
async function isContract(address) {
  const code = await web3.eth.getCode(address)
  return code.slice(2).length > 0
}

module.exports = {
  buildCreate2Address: buildCreate2Address,
  numberToUint256: numberToUint256,
  encodeParam: encodeParam,
  isContract: isContract,
}