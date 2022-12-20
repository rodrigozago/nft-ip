//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract IntellectualWork is ERC721 {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  event NFTMinted(uint256 indexed _tokenID);


  mapping (uint256 => string) private _tokenURIs;


  constructor(
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) {
    
  }


  function mint(string memory _tokenURI, uint256 _tokenID)  public returns (uint256) {
   
    _safeMint(msg.sender, _tokenID);
    
    _setTokenURI(_tokenID, _tokenURI);
    emit NFTMinted(_tokenID);

    return _tokenID;
  }

  function _setTokenURI(uint256 _tokenID, string memory _tokenURI) internal virtual {
    require(
      _exists(_tokenID),
      "ERC721Metadata: URI set of nonexistent token"
    );
    _tokenURIs[_tokenID] = _tokenURI;
  }

  function tokenURI(uint256 _tokenID) public view virtual override returns(string memory) {
    require(
      _exists(_tokenID),
      "ERC721Metadata: URI get of nonexistent token"
    );
    return _tokenURIs[_tokenID];
  }

}
