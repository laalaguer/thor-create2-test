# Thor OpCode External Feature Test
```
CREATE2
EXTCODEHASH
```

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
account.sol  // target contract to be CREATE2-ed by factory.sol.
constants.js // Keys/Bytecode/ABI/
examer.sol   // EXTCODEHASH contract.
factory.sol  // father contract to deploy account.sol via CREATE2
helpers.js   // calculation helpers.
test.js      // main test routine.
```

## Compiler
Solidity 0.5.3