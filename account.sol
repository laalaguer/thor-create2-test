pragma solidity ^0.5.3;

contract Account {
  // automatically creates a "owner" public function.
  address public owner;

  constructor(address payable _owner) public {
    owner = _owner;
  }

  function setOwner(address _owner) public {
    require(msg.sender == owner);
    owner = _owner;
  }

  function destroy(address payable recipient) public {
    require(msg.sender == owner);
    selfdestruct(recipient);
  }

  function() payable external {}
}