pragma solidity ^0.4.24;

contract IpfsStorage {
    struct Multihash {
      uint8 hashFunction;
      uint8 size;
    }

    mapping (bytes32 => Multihash) public itemMetadataMapping;
    bytes32[] public itemHashes;

    event ItemAdded(bytes32 contentHash);

    function addIpfsItem(bytes32 contentHash, uint8 hashFunction, uint8 size) public returns(bool) {
      itemMetadataMapping[contentHash] = Multihash({hashFunction: hashFunction, size: size});
      itemHashes.push(contentHash);
      emit ItemAdded(contentHash);
      return true;
    }

    function getIpfsItems() public constant returns(bytes32[]) {
        return itemHashes;
    }

    function getItemMetadata(bytes32 contentHash) public constant returns(uint8 hashFunction, uint8 size) {
        Multihash memory data = itemMetadataMapping[contentHash];
        return (data.hashFunction, data.size);
    }
}
