pragma solidity ^0.5.3;

contract Factory {
  event Deployed(address addr, uint256 salt);

  function deploy(bytes memory code, uint256 salt) public {
    address addr;
    assembly {
      addr := create2(0, add(code, 0x20), mload(code), salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }

    emit Deployed(addr, salt);
  }
}

// https://solidity.readthedocs.io/en/v0.5.3/assembly.html
// solidity assembly explanation.
// create2(v, p, n, s)
// create new contract with code mem[p…(p+n)) at address keccak256(0xff . this . s . keccak256(mem[p…(p+n))) and send v wei and return the new address, where 0xff is a 8 byte value, this is the current contract’s address as a 20 byte value and s is a big-endian 256-bit value
// "bytes memory code"
// the start address for code memory array, each item is 32 bytes. First item is length of array. code = [length][0][1][2]
// "add(code, 0x20)"
// 0x20 = 32
// Jump over first 32 bytes (first slot), because it contains only length information.
// So get the offset we need.
// "mload(code)"
// load things from code position, which is the first slot, which is the length value.
// So get the size we need.

// Ethereum evm.go source code.
// func opCreate2(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
// var (
// 	endowment    = stack.pop()
// 	offset, size = stack.pop(), stack.pop()
// 	salt         = stack.pop()
// 	input        = memory.Get(offset.Int64(), size.Int64())
// 	gas          = contract.Gas
// )
// So we can see "stack" poped 4 arguments, they are:
//      "endowment", "offset", "size", "salt".