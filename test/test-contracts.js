const { ethers } = require('hardhat');
const { expect } = require('chai')

describe('NFT Market', function() {

  let market
  let marketAddress
  let nft
  let nftAddress

  beforeEach(async function() {
    const Market = await ethers.getContractFactory('NFTMarket');
    market = await Market.deploy();
    await market.deployed();
    marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    nftAddress = nft.address
  })

  it('Should create and execute sales', async function() {
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken('https://www.mytoken.com/1')
    await nft.createToken('https://www.mytoken.com/2')

    await market.createMarketItem(nftAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftAddress, 1, { value: auctionPrice })

    let items = await market.fetchMarketItems()

    items = await Promise.all(
      items.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        return {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
      })
    )

    console.log('store items: ', items)

    const itemsBought = await market.connect(buyerAddress).fetchMyBoughtNFTs()

    const readableItemsBought = await Promise.all(
      itemsBought.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        return {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
      })
    )

    console.log('items bought', readableItemsBought)
  });
});
