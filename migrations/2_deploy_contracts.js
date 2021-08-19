/* eslint-disable no-undef */
// const HonestSharing = artifacts.require("HonestSharing");
const Decentragram = artifacts.require("Decentragram");

module.exports = function(deployer) {
  // deployer.deploy(HonestSharing);
  deployer.deploy(Decentragram);
};
