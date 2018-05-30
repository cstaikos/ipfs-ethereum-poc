pragma solidity ^0.4.24;

contract SimpleStorage {
    bytes32[] public items;

    event ItemAdded(bytes32 contents);

    function addStorageItem(bytes32 contents) public returns(bool) {
        items.push(contents);
        emit ItemAdded(contents);
        return true;
    }

    function getStorageItems() public constant returns(bytes32[]) {
      return items;
    }
}
