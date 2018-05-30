var Web3 = require('web3');
var ipfsAPI = require('ipfs-api');
var fs = require('fs');
var simpleStorageABI = require('./build/contracts/SimpleStorage.json').abi;
var contractAddress = require('./contractAddress.js').address;
var Buffer = require('buffer').Buffer;

var web3 = new Web3();
web3.setProvider(new web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));

var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

var app = new Vue({
  el: "#app",
  data: {
    accounts: [],
    fromAddress: null,
    toAddress: null,
    value: 0,
    storageItems: [],
    itemsAdded: [],
    itemData: null,
    contract: null,
    fileToUpload: null
  },
  methods: {
    sendTransaction: function() {
      web3.eth.sendTransaction({from: this.fromAddress, to: this.toAddress, value: web3.toWei(this.value)});
    },
    addItem: function() {
      var that = this;
      this.contract.methods.addItem(web3.utils.fromAscii(this.itemData)).send({from: this.accounts[0]}, function(error, result) {
        that.getItems();
      });
    },
    getItems: function() {
      this.storageItems = [];
      var numItems = 0;
      var that = this;
      this.contract.methods.getItemsLength().call({from: this.accounts[0]})
      .then(function(result) {
        numItems = result;
        return;
      })
      .then(function() {
        for(var i=0; i<numItems; i++) {
          that.contract.methods.getItemByIndex(i).call({from: that.accounts[0]})
          .then(function(result) {
            that.storageItems.push(web3.utils.toAscii(result));
          });
        }
      });
    },
    init: function() {
      var that = this;
      web3.eth.getAccounts().then(function(result) {that.accounts = result;});

      this.contract = new web3.eth.Contract(
        simpleStorageABI,
        contractAddress,
        {
          from: this.accounts[0],
          gasPrice: '20000000000',
          gas: '100000'
        }
      );
    },
    setupEventListeners: function() {
      var that = this;
      this.contract.events.ItemAdded({}, function(error, result) {
        if (error) {
          console.log(error);
          return;
        }
        that.itemsAdded.push(web3.utils.toAscii(result.returnValues.contents));
      });
    },
    grabFile: function(e) {
      this.fileToUpload = e.target.files[0];
    },
    uploadFile: function() {
        var reader = new FileReader();

        reader.onload = function(e) {
          ipfs.files.add(new Buffer(e.target.result), function(err, res){
              if(err) {
                console.log("Error saving to IPFS", err);
              }
              else {
                console.log("File saved to IPFS", res);
              }
          });
        };
        reader.readAsArrayBuffer(this.fileToUpload);
  },
  created: function() {
    this.init();
    this.getItems();
    this.setupEventListeners();
  }
}
});
