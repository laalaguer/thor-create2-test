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