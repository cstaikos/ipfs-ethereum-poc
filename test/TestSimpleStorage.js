/* global artifacts contract it assert */
var SimpleStorage = artifacts.require('SimpleStorage');

contract('SimpleStorage', function (accounts) {
  it('should be empty to start', function () {
    return SimpleStorage.deployed().then(function (instance) {
      return instance.getItemsLength.call();
    }).then(function (size) {
      assert.equal(size, 0, 'Storage was not empty to start');
    });
  });

  it('should allow an item to be added', function () {
    var itemSize;
    var instance;
    return SimpleStorage.deployed().then(function (newInstance) {
      instance = newInstance;
      return instance.addItem(web3.fromAscii('test'), {from: accounts[0]});
    }).then(function () {
      return instance.getItemsLength.call();
    }).then(function (size) {
      itemSize = size;
      return instance.getItemByIndex.call(0);
    }).then(function (result) {
      assert.equal(itemSize, 1, 'Storage size increased to 1');
      assert.equal(web3.toAscii(result).replace(/\u0000/g, ''), 'test', 'Correct item added to storage');
    });
  });
});
