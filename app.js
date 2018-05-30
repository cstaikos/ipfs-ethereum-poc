var Web3 = require('web3');
var ipfsAPI = require('ipfs-api');
var fs = require('fs');
var _ = require('lodash');
var simpleStorageABI = require('./build/contracts/SimpleStorage.json').abi;
var contractAddresses = require('./contractAddresses.js');
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
    storageItemsAdded: [],
    ipfsItems: [],
    ipfsItemsAdded: [],
    itemData: null,
    storageContract: null,
    fileToUpload: null
  },
  methods: {
    sendTransaction: function() {
      web3.eth.sendTransaction({from: this.fromAddress, to: this.toAddress, value: web3.toWei(this.value)});
    },
    addStorageItem: function() {
      var that = this;
      this.storageContract.methods.addStorageItem(web3.utils.fromAscii(this.itemData)).send({from: this.accounts[0]}, function(error, result) {
        that.getStorageItems();
      });
    },
    getStorageItems: function() {
      this.storageItems = [];
      var numItems = 0;
      var that = this;
      this.storageContract.methods.getStorageItems().call({from: this.accounts[0]})
      .then(function(result) {
        that.storageItems = _.map(result, function(item) {
          return web3.utils.toAscii(item);
        });
      });
    },
    init: function() {
      var that = this;
      web3.eth.getAccounts().then(function(result) {that.accounts = result;});
      this.storageContract = new web3.eth.Contract(
        simpleStorageABI,
        contractAddresses.storage,
        {
          from: this.accounts[0],
          gasPrice: '20000000000',
          gas: '100000'
        }
      );
    },
    setupEventListeners: function() {
      var that = this;
      this.storageContract.events.ItemAdded({}, function(error, result) {
        if (error) {
          console.log(error);
          return;
        }
        that.storageItemsAdded.push(web3.utils.toAscii(result.returnValues.contents));
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
  }
},
created: function() {
  this.init();
  this.getStorageItems();
  this.setupEventListeners();
}
});
