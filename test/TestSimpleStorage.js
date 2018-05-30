/* global artifacts contract it assert */
var SimpleStorage = artifacts.require('SimpleStorage');

contract('SimpleStorage', function (accounts) {
  it('should allow an item to be added', function () {
    var itemSize;
    var instance;
    return SimpleStorage.deployed().then(function (newInstance) {
      instance = newInstance;
      return instance.addItem(web3.fromAscii('test'), {from: accounts[0]});
    }).then(function () {
      return instance.getItems.call();
    }).then(function (result) {
      items = result;
      assert.equal(items.length, 1, 'Storage size increased to 1');
      assert.equal(web3.toAscii(items[0]).replace(/\u0000/g, ''), 'test', 'Correct item added to storage');
    });
  });
});
