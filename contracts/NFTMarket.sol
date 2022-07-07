// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _editionsIds;
  Counters.Counter private _marketItemsIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  uint256 listingPrice = 0.025 ether;

  address tokenContractAddress;
  IERC20 wetToken;

  constructor(address tokenAddress) {
    owner = payable(msg.sender);
    tokenContractAddress = tokenAddress;
    wetToken = IERC20(tokenAddress);
  }

  // one edition has many marketItems
  struct EditionItem {
    uint editionListPointer;
    bytes32[] itemsKeys;
    mapping(bytes32 => uint) marketItemKeyPointers;
  }

  mapping(bytes32 => EditionItem) private editionStructs;
  bytes32[] private editionList;

  // marketItem belongs to an edition Item
  struct MarketItem {
    uint marketItemPointer;
    bytes32 editionKey;

    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    uint edition;
  }

  mapping(bytes32 => MarketItem) private marketItemStructs;
  bytes32[] private marketItemsList;

  function getEditionsCount() private returns(uint editionsCount) { return editionList.length; }

  function getMarketItemsCount() private returns(uint marketItemsCount) { return marketItemsList.length; }

  function isEdition(bytes32 editionId) private returns(bool isIndeed) {
    /* console.log('IS EDITION -----------------------------------------------------------------'); */
    /* console.logBytes32(editionId); */
    if(editionList.length == 0) return false;
    /* console.logBytes32(editionList[editionStructs[editionId].editionListPointer]); */
    /* console.log(editionList[editionStructs[editionId].editionListPointer] == editionId); */
    /* console.log('END IS EDITION -----------------------------------------------------------------'); */
    return editionList[editionStructs[editionId].editionListPointer] == editionId;
  }

  function isMarketItem(bytes32 marketItemId) private returns(bool isIndeed) {
    console.log('IS MARKET ITEM -----------------------------------------------------------------');
    console.logBytes32(marketItemId);
    if(marketItemsList.length == 0) return false;
    console.logBytes32(marketItemsList[marketItemStructs[marketItemId].marketItemPointer]);
    console.log(marketItemsList[marketItemStructs[marketItemId].marketItemPointer] == marketItemId);
    console.log('END IS MARKET ITEM -----------------------------------------------------------------');
    return marketItemsList[marketItemStructs[marketItemId].marketItemPointer] == marketItemId;
  }

  function getEditionItemsCount(bytes32 editionId) private returns(uint marketItemsCount) {
    require(isEdition(editionId), "Edition not found.");
    return editionStructs[editionId].itemsKeys.length;
  }

  function getItemsFromEditionAtIndex(bytes32 editionId, uint row) private returns(bytes32 itemsKey) {
    require(isEdition(editionId), "Edition not found.");
    return editionStructs[editionId].itemsKeys[row];
  }

  function createEdition(bytes32 editionId) private returns(bool success) {
    console.logBytes32(editionId);
    require(!isEdition(editionId), "Edition already exists.");
    editionList.push(editionId);
    editionStructs[editionId].editionListPointer = editionList.length - 1;
    return true;
  }

  function createMarketItem(
    bytes32 editionId,
    bytes32 marketItemId,
    address nftContract,
    uint256 tokenId,
    uint256 tokenEditions,
    uint256 price,
    uint256 edition
  ) private returns(bool success) {

    console.log('=============');
    console.log('marketItemId:');
    console.logBytes32(marketItemId);
    console.log('');
    console.log('editionId: ');
    console.logBytes32(editionId);
    console.log('');
    console.log('nftContract: ', nftContract);
    console.log('tokenId: ', tokenId);
    console.log('tokenEditions: ', tokenEditions);
    console.log('price: ', price);
    console.log('edition: ', edition);
    console.log('=============');

    require(isEdition(editionId), "Edition not found.");
    require(!isMarketItem(marketItemId), "Market item already exists");
    marketItemsList.push(marketItemId);
    marketItemStructs[marketItemId].marketItemPointer = marketItemsList.length - 1;
    marketItemStructs[marketItemId].editionKey = editionId;

    marketItemStructs[marketItemId].nftContract = nftContract;
    marketItemStructs[marketItemId].tokenId = tokenId;
    marketItemStructs[marketItemId].seller = payable(msg.sender);
    marketItemStructs[marketItemId].owner = payable(address(0));
    marketItemStructs[marketItemId].price = price;
    marketItemStructs[marketItemId].sold = false;
    marketItemStructs[marketItemId].edition = edition;

    editionStructs[editionId].itemsKeys.push(marketItemId);
    editionStructs[editionId].marketItemKeyPointers[marketItemId] = editionStructs[editionId].itemsKeys.length - 1;
    return true;
  }

  function deleteEdition(bytes32 editionId) private returns(bool success) {
    require(!isEdition(editionId), "Edition not found.");
    require(editionStructs[editionId].itemsKeys.length > 0, "Edition has market items");

    uint rowToDelete = editionStructs[editionId].editionListPointer;
    bytes32 keyToMove = editionList[editionList.length - 1];

    editionList[rowToDelete] = keyToMove;
    editionStructs[keyToMove].editionListPointer = rowToDelete;
    editionList.pop();
    return true;
  }

  function deleteMarketItem(bytes32 marketItemId) private returns(bool success) {
    require(!isMarketItem(marketItemId), "Market Item not found");

    uint rowToDelete = marketItemStructs[marketItemId].marketItemPointer;
    bytes32 keyToMove = marketItemsList[marketItemsList.length - 1];
    marketItemsList[rowToDelete] = keyToMove;
    marketItemStructs[marketItemId].marketItemPointer = rowToDelete;
    marketItemsList.pop();

    bytes32 editionId = marketItemStructs[marketItemId].editionKey;
    rowToDelete = editionStructs[editionId].marketItemKeyPointers[marketItemId];
    keyToMove = editionStructs[editionId].itemsKeys[editionStructs[editionId].itemsKeys.length - 1];
    editionStructs[editionId].itemsKeys[rowToDelete] = keyToMove;
    editionStructs[editionId].marketItemKeyPointers[keyToMove] = rowToDelete;
    editionStructs[editionId].itemsKeys.pop();
    return true;
  }

  event MarketItemCreated (
    bytes32 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingPrice() public view returns(uint256) {
    return listingPrice;
  }

  function createMarketItemOld(
    address nftContract,
    uint256 tokenId,
    uint256 tokenEditions,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _editionsIds.increment();
    bytes32 editionId = bytes32(_editionsIds.current());

    bool ret = createEdition(editionId);
    console.log('created Edition', ret);
    console.logBytes32(editionId);

      console.log('---- parameters');
      console.log('editionId:');
      console.logBytes32(editionId);
      console.log('nftContract: ', nftContract);
      console.log('tokenId: ', tokenId);
      console.log('tokenEditions: ', tokenEditions);
      console.log('price: ', price);
    for (uint i = 0; i < tokenEditions; i++) {

      _marketItemsIds.increment();
      bytes32 marketItemId = bytes32(_marketItemsIds.current());

      console.log('edition: ', i + 1);
      createMarketItem(
        editionId,
        marketItemId,
        nftContract,
        tokenId,
        tokenEditions,
        price,
        i + 1
      );
      console.log('--------');
    }

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      editionId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function transferToken(address to, uint256 amount) public {
    uint256 balance = wetToken.balanceOf(msg.sender);
    require(amount <= balance, "balance is low");
    wetToken.transfer(to, amount);
    /* emit TransferSent(msg.sender, to, amount); */
  }

  /* function createMarketSale( */
  /*   address nftContract, */
  /*   uint256 itemId, */
  /*   uint256 itemEdition */
  /* ) public payable nonReentrant { */
  /*   uint price = idToMarketItem[itemId][itemEdition].price; */
  /*   uint tokenId = idToMarketItem[itemId][itemEdition].tokenId; */
  /*   require(msg.value == price, "Please submit the asing price in order to complete the purchase"); */

  /*   wetToken.transferFrom(msg.sender, idToMarketItem[itemId][itemEdition].seller, msg.value); */

  /*   IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); */
  /*   idToMarketItem[itemId][itemEdition].owner = payable(msg.sender); */
  /*   idToMarketItem[itemId][itemEdition].sold = true; */
  /*   _itemsSold.increment(); */
  /*   payable(owner).transfer(listingPrice); */
  /* } */

  /* function fetchMarketItems() public view returns (MarketItem[] memory) { */
  /*   uint itemCount = _itemsIds.current(); */
  /*   uint unsoldItemCount = _itemsIds.current() - _itemsSold.current(); */
  /*   uint currentIndex = 0; */

  /*   MarketItem[] memory items = new MarketItem[](unsoldItemCount); */
  /*   for (uint i = 0; i < itemCount; i++) { */
  /*     if (idToMarketItem[i + 1].owner == address(0)) { */
  /*       uint currentId = idToMarketItem[i + 1].itemId; */
  /*       MarketItem storage currentItem = idToMarketItem[currentId]; */
  /*       items[currentIndex] = currentItem; */
  /*       currentIndex += 1; */
  /*     } */
  /*   } */
  /*   return items; */
  /* } */

  /* function fetchMySellingNFTs() public view returns (MarketItem[] memory) { */
  /*   uint totalItemCount = _itemsIds.current(); */
  /*   uint itemCount = 0; */
  /*   uint currentIndex = 0; */

  /*   for (uint i = 1; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].seller == msg.sender) { */
  /*       itemCount += 1; */
  /*     } */
  /*   } */

  /*   MarketItem[] memory items = new MarketItem[](itemCount); */
  /*   for (uint i = 0; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].owner == address(0)) { */
  /*       uint currentId = idToMarketItem[i + 1].itemId; */
  /*       MarketItem storage currentItem = idToMarketItem[currentId]; */
  /*       items[currentIndex] = currentItem; */
  /*       currentIndex += 1; */
  /*     } */
  /*   } */
  /*   return items; */
  /* } */

  /* function fetchMyBoughtNFTs() public view returns (MarketItem[] memory) { */
  /*   uint totalItemCount = _itemsIds.current(); */
  /*   uint itemCount = 0; */
  /*   uint currentIndex = 0; */

  /*   for (uint i = 0; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].owner == msg.sender) { */
  /*       itemCount += 1; */
  /*     } */
  /*   } */

  /*   MarketItem[] memory items = new MarketItem[](itemCount); */
  /*   for (uint i = 0; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].owner == msg.sender) { */
  /*       uint currentId = idToMarketItem[i + 1].itemId; */
  /*       MarketItem storage currentItem = idToMarketItem[currentId]; */
  /*       items[currentIndex] = currentItem; */
  /*       currentIndex += 1; */
  /*     } */
  /*   } */
  /*   return items; */
  /* } */

  /* function fetchItemsCreated() public view returns (MarketItem[] memory) { */
  /*   uint totalItemCount = _itemsIds.current(); */
  /*   uint itemCount = 0; */
  /*   uint currentIndex = 0; */

  /*   for (uint i = 0; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].seller == msg.sender) { */
  /*       itemCount += 1; */
  /*     } */
  /*   } */

  /*   MarketItem[] memory items = new MarketItem[](itemCount); */
  /*   for (uint i = 0; i < totalItemCount; i++) { */
  /*     if (idToMarketItem[i + 1].seller == msg.sender) { */
  /*       uint currentId = idToMarketItem[i + 1].itemId; */
  /*       MarketItem storage currentItem = idToMarketItem[currentId]; */
  /*       items[currentIndex] = currentItem; */
  /*       currentIndex += 1; */
  /*     } */
  /*   } */
  /*   return items; */
  /* } */
}
