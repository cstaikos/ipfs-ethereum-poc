pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
  function testAddOneItem() public {
    SimpleStorage simpleStorage = new SimpleStorage();
    simpleStorage.addItem("0x123");

    bytes32 result = simpleStorage.getItemByIndex(0);

    Assert.equal(uint(simpleStorage.getItemsLength()), uint(1), "Should be one item in storage");
    Assert.equal(result, "0x123", "Item we added should be at index 0");
  }
}
