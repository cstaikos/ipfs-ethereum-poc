pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
  function testAddOneItem() public {
    SimpleStorage simpleStorage = new SimpleStorage();
    simpleStorage.addStorageItem("0x123");

    bytes32[] memory result = simpleStorage.getStorageItems();

    Assert.equal(uint(result.length), 1, "Should be one item");
    Assert.equal(result[0], "0x123", "Item in storage should be the one we added");
  }
}
