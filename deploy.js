Web3 = require('web3');
solc = require('solc');
fs = require('fs');

web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

code = fs.readFileSync('SimpleStorage.sol').toString();
compiledCode = solc.compile(code);
abiDefinition = JSON.parse(compiledCode.contracts[':SimpleStorage'].interface);
byteCode = compiledCode.contracts[':SimpleStorage'].bytecode;
account = "";
gasLimit = 0;
deployedContract = null;

web3.eth.getBlock('latest').then(function(result){
  gasLimit = result.gasLimit;
})
.then(function() {
  web3.eth.getAccounts()
  .then(function(result) {
    account = result[0];
  })
  .then(function() {
    simpleStorageContract = new web3.eth.Contract(abiDefinition, {data: byteCode, from: account, gas: gasLimit});
    simpleStorageContract.deploy({data: byteCode, arguments: null})
    .send(function(error, txHash) {
      console.log("Transaction Hash" + txHash);
    })
    .then(function(result) {
      deployedContract = result;
      contractAddress = deployedContract.options.address;
      fs.writeFile("./contractAddress.js", "module.exports = {address: \"" + contractAddress + "\"}", function(err){
        if(err) {
          return console.log(err)
        }
        console.log("Contract address saved!");
      })
      fs.writeFile("./simpleStorageABI.js", "module.exports = {abi: " + JSON.stringify(abiDefinition) + "}", function(err){
        if(err) {
          return console.log(err)
        }
        console.log("Contract ABI saved!");
      })
    }
  );
})
})
