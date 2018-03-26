var Web3 = require('web3');
var ipfsAPI = require('ipfs-api');
var contractAddress = require('./contractAddress.js').address;
var simpleStorageABI = require('./simpleStorageABI.js').abi;

var web3 = new Web3();
web3.setProvider(new web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));

var ipfs = ipfsAPI();
console.log(ipfs);

var app = new Vue({
  el: "#app",
  data: {
    accounts: [],
    fromAddress: null,
    toAddress: null,
    value: 0,
    storageItems: [],
    itemData: null,
    contract: null
  },
  methods: {
    sendTransaction: function() {
      web3.eth.sendTransaction({from: this.fromAddress, to: this.toAddress, value: web3.toWei(this.value)})
    },
    addItem: function() {
      var that = this;
      this.contract.methods.addItem(this.itemData).send({from: this.accounts[0]}, function(error, result) {
        that.getItems();
      });
    },
    getItems: function() {
      this.storageItems = [];
      var numItems = 0;
      var that = this;
      this.contract.methods.getItemsLength().call(this.accounts[0])
      .then(function(result) {
        numItems = result;
        return;
      })
      .then(function() {
        for(var i=0; i<numItems; i++) {
          that.contract.methods.getItemByIndex(i).call(that.accounts[0])
          .then(function(result) {
            that.storageItems.push(result);
          })
        }
      });
    },
    initData: function() {
      var that = this;
      web3.eth.getAccounts().then(function(result) {that.accounts = result;});
    },
    initContract: function() {
      this.contract = new web3.eth.Contract(
        simpleStorageABI,
        contractAddress,
        {
          from: this.accounts[0],
          gasPrice: '20000000000',
          gas: '100000'
        }
      )
    },
    setupEventListeners: function() {
      this.contract.events.ItemAdded({}, function(error, result) {
        if (error) {
          console.log(error);
          return;
        }
        alert(result);
      })
    }
  },
  created: function() {
    this.initContract();
    this.initData();
    this.getItems();
    this.setupEventListeners();
  }
});
