var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var fs = require('fs');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage)
  .then(function() {
    fs.writeFile("./contractAddress.js", "module.exports = {address: \"" + SimpleStorage.address + "\"}", function(err) {
      if (err) {
        console.log("Error writing address");
        return;
      }
      console.log("Address saved for SimpleStorage contract to contractAddress.js");
    })
  }) ;
};
