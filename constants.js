module.exports = {
    creatorAddress: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
    creatorPrivateKey: "DCE1443BD2EF0C2631ADC1C67E5C93F13DC23A41C18B536EFFBBDCBCDB96FB65",

    userAddress: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
    userPrivateKey: "321D6443BC6177273B5ABF54210FE806D451D6B7973BCCC2384EF78BBCD0BF51",

    bystanderAddress: "0x733b7269443c70de16bbf9b0615307884bcc5636",
    bystanderPrivateKey: "2d7c882bad2a01105e36dda3646693bc1aaaa45b0ed63fb0ce23c060294f3af2",

    factoryBytecode: "0x608060405234801561001057600080fd5b506101c9806100206000396000f3fe608060405234801561001057600080fd5b5060043610610048576000357c0100000000000000000000000000000000000000000000000000000000900480639c4ae2d01461004d575b600080fd5b6101106004803603604081101561006357600080fd5b810190808035906020019064010000000081111561008057600080fd5b82018360208201111561009257600080fd5b803590602001918460018302840111640100000000831117156100b457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190929190505050610112565b005b6000818351602085016000f59050803b151561012d57600080fd5b7fb03c53b28e78a88e31607a27e1fa48234dce28d5d9d9ec7b295aeb02e674a1e18183604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150505056fea165627a7a723058204557c463603012531801162c4dcf5bf490c0e74d993579bfe89c7c7a7318cba60029",
    factoryAbi: [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "code",
                    "type": "bytes"
                },
                {
                    "name": "salt",
                    "type": "uint256"
                }
            ],
            "name": "deploy",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
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
            ],
            "name": "Deployed",
            "type": "event"
        }
    ],

    accountBytecode: "0x608060405234801561001057600080fd5b5060405160208061033f8339810180604052602081101561003057600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506102ae806100916000396000f3fe608060405260043610610050576000357c010000000000000000000000000000000000000000000000000000000090048062f55d9d1461005257806313af4035146100a35780638da5cb5b146100f4575b005b34801561005e57600080fd5b506100a16004803603602081101561007557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061014b565b005b3480156100af57600080fd5b506100f2600480360360208110156100c657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101bf565b005b34801561010057600080fd5b5061010961025d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156101a657600080fd5b8073ffffffffffffffffffffffffffffffffffffffff16ff5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561021a57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea165627a7a723058208ba63c10b23e5529465ebd756b29dda4aa86e467795e6233743c47776185a1600029",
    accountAbi: [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "destroy",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "setOwner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        }
    ],

}