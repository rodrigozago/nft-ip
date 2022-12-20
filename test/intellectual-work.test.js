const { expect } = require('chai');
const { ethers } = require("hardhat")
var MD5 = require("crypto-js/md5");

// truncte the hash to create a tokenID based on the contentID
const hashTruncation = 14;

// IntellectualWork class
class IntellectualWorkClass {
  constructor(contentID) {
    this.contentID = 'QmcGV8fimB7aeBxnDqr7bSSLUWLeyFKUukGqDhWnvriQ3T';
    this.tokenID = parseInt(
      MD5(this.contentID)
      .toString()
      .substring(0, hashTruncation), 16);
    this.tokenURI = `ipfs://${this.contentID}`;
  }
}


describe("IntellectualWork Class Tests", function () {
  let iw;
  this.beforeEach(async function () {
    iw = new IntellectualWorkClass();
  })

  it('intellectual work object is properly instantiated', function () {
    expect(iw).to.be.an.instanceof(IntellectualWorkClass);
  });

  it('intellectual work object has a content id', function () {
    expect(iw).to.have.property('contentID');
  });

  it('intellectual work object has a tokenURI', function () {
    expect(iw).to.have.property('tokenURI');
  });

  it('intellectual work object has a tokenID', function () {
    expect(iw).to.have.property('tokenID');
  });

  it('the tokenID is a MD5 hash of the content', function () {
    const tokenID = parseInt(
      MD5(iw.contentID)
      .toString()
      .substring(0, hashTruncation), 16);
    expect(tokenID).to.equal(iw.tokenID);
  });

})

describe("IntellectualWork Smart Contract Tests", function () {
  let IntellectualWorkContract;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const IntellectualWork = await ethers.getContractFactory("IntellectualWork");
    IntellectualWorkContract = await IntellectualWork.deploy("IntellectualWork Contract", "ART");
  })


  it("NFT is minted successfully", async function () {
    [account1] = await ethers.getSigners();

    expect(await IntellectualWorkContract.balanceOf(account1.address)).to.equal(0);

    const iw = new IntellectualWorkClass();

    const tx = await IntellectualWorkContract.connect(account1)
      .mint(iw.tokenURI, iw.tokenID);

    expect(await IntellectualWorkContract.balanceOf(account1.address)).to.equal(1);
  })

  it("NFT has right token id", async function () {
    [account1] = await ethers.getSigners();

    expect(await IntellectualWorkContract.balanceOf(account1.address)).to.equal(0);

    const iw = new IntellectualWorkClass();

    const tx = await IntellectualWorkContract.connect(account1)
      .mint(iw.tokenURI, iw.tokenID);
    
    const txReceipt = await tx.wait();

    const [transferEvent] = txReceipt.events;

    const { tokenId } = transferEvent.args;

    const tokenIdNumber = tokenId.toNumber()

    expect(await IntellectualWorkContract.balanceOf(account1.address))
      .to.emit(IntellectualWorkContract, "NFTMinted")
      .withArgs(iw.tokenID);
  })

  it("NFT has right token hash", async function () {
    [account1] = await ethers.getSigners();

    expect(await IntellectualWorkContract.balanceOf(account1.address)).to.equal(0);

    const iw = new IntellectualWorkClass();

    const tx = await IntellectualWorkContract.connect(account1)
      .mint(iw.tokenURI, iw.tokenID);
    
    const txReceipt = await tx.wait();

    const [transferEvent] = txReceipt.events;

    const { tokenId } = transferEvent.args;

    const tokenIdNumber = tokenId.toNumber()

    const retriviedTokenUri = await IntellectualWorkContract.connect(account1).tokenURI(tokenIdNumber);
    
    // remove the ipfs:// prefix
    const retrivedTokenHash = retriviedTokenUri.replace('ipfs://', '');

    const tokenHash = iw.contentID;

    expect(retrivedTokenHash).to.equal(tokenHash);

  })

})
