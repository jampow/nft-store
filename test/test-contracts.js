const { ethers } = require("hardhat");

describe("NFT Market", function() {
  it("Should create and execute sales", async function() {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken('https://www.mytoken.com')
    await nft.createToken('https://www.mytoken2.com')

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

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

    const itemsBought = await market.connect(buyerAddress).fetchMyNFTs()

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
