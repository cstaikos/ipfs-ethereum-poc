Web3 = require('web3');
solc = require('solc');
fs = require('fs');

web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

code = fs.readFileSync('SimpleStorage.sol').toString();
compiledCode = solc.compile(code);
abiDefinition = JSON.parse(compiledCode.contracts[':SimpleStorage'].interface);
byteCode = compiledCode.contracts[':SimpleStorage'].bytecode;
account = "0xd6e174c554F7CE29700046e0971f8c960Ee28338";
gasLimit = 0;
deployedContract = null;

web3.eth.getBlock('latest').then(function(result){
  gasLimit = result.gasLimit;
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
      fs.writeFile("./contractAddress.js", "var contractAddress = \"" + contractAddress + "\".toString();", function(err){
        if(err) {
          return console.log(err)
        }
        console.log("Contract address saved!");
      })
      fs.writeFile("./simpleStorageABI.js", "var simpleStorageABI = " + JSON.stringify(abiDefinition), function(err){
        if(err) {
          return console.log(err)
        }
        console.log("Contract ABI saved!");
      })
    }
  );
})
