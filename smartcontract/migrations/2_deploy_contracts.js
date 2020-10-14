var TripleTronContract = artifacts.require("./TripleTronContract.sol");

module.exports = function(deployer) {
  deployer.deploy(TripleTronContract, 'TUDxQVz6bJmoJoMqSMJzXwngfCK5JNqEX9');
};
