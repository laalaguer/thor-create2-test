# Create2 Feature Test

## Topology

```
+-----------+           +-----------+          +------------------+
|           |           |           |          |                  |
|  Test.js  +-----------> WEB3-GEAR +----------> THOR (solo mode) |
|           |           |           |          |                  |
+-----------+           +-----------+          +------------------+

```

## Run The Test

1. Start the thor in solo mode by command: `thor solo --gas-limit 100000000 --on-demand --persist --api-addr 127.0.0.1:8669 --data-dir ./testnet-data --verbosity 9`

2. Start the `web3-gear` on `http://localhost:8545`

3. Run test

```
npm install
npm run test
```

## Files
```
test.js         # main test file.
helpers.js      # utility functions.
constants.js    # constant values, to be imported.
account.sol     # account contract solidity code.
factory.sol     # factory contract solidigy code.
```

## Tested Solidity Compiler
`solc 0.5.3`
