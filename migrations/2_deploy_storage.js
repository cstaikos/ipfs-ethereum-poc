var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var IpfsStorage = artifacts.require("./IpfsStorage.sol");
var fs = require('fs');

module.exports = function(deployer) {
  var simpleStorageAddress;
  var ipfsSstorageAddress;
  deployer.deploy(SimpleStorage).then(function() {
    simpleStorageAddress = SimpleStorage.address;
    deployer.deploy(IpfsStorage).then(function() {
      fs.writeFile("./contractAddresses.js", "module.exports = {storage: \"" + simpleStorageAddress + "\", ipfs: \"" + IpfsStorage.address + "\"}", function(err) {
        if (err) {
          console.log("Error writing address");
          return;
        }
        console.log("Contract addresses saved to contractAddresses.js");
      });
    });
  });
};
