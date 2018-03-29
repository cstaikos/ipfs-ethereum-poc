pragma solidity ^0.4.0;

contract SimpleStorage {
    bytes32[] public items;

    event ItemAdded(bytes32 contents);

    function addItem(bytes32 contents) public returns(bool) {
        items.push(contents);
        emit ItemAdded(contents);
        return true;
    }

    function getItemByIndex(uint256 index) public constant returns(bytes32) {
        require(index < items.length);
        return items[index];
    }

    function getItemsLength() public constant returns(uint256) {
        return items.length;
    }
}
