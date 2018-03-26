pragma solidity ^0.4.0;

contract SimpleStorage {
    string[] public items;

    event ItemAdded(string contents);

    function SimpleStorage() public {}

    function addItem(string contents) public returns(bool) {
        items.push(contents);
        emit ItemAdded(contents);
        return true;
    }

    function getItemByIndex(uint256 index) public constant returns(string) {
        require(index < items.length);
        return items[index];
    }

    function getItemsLength() public constant returns(uint256) {
        return items.length;
    }
}