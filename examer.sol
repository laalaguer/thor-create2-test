pragma solidity ^0.5.3;

contract Examer {
  event Detected(address addr, bytes32 hashResult);

  function detect(address addr) public returns (bytes32) {
    bytes32 value;
    assembly {
      value := extcodehash(addr)
    }

    emit Detected(addr, value);
    return value;
  }
}