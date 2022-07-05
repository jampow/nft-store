const { ethers } = require('hardhat');
const { expect } = require('chai')

describe('NFT Market', function() {

  let market
  let marketAddress

  let taps
  let tapsAddress

  let nft
  let nftAddress

  let owner
  let buyer

  beforeEach(async function() {
    [owner, buyer] = await ethers.getSigners()

    const Market = await ethers.getContractFactory('NFTMarket');
    market = await Market.deploy();
    await market.deployed();
    marketAddress = market.address

    const TAPs = await ethers.getContractFactory('WetTaps')
    taps = await TAPs.deploy()
    await taps.deployed()
    tapsAddress = taps.address

    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    nftAddress = nft.address
  })

  it('should buy some taps', async function() {
    const amount = ethers.utils.parseEther('1.0')

    const transaction = await buyer.sendTransaction({
      to: taps.address,
      value: amount
    })

    const balance = await taps.balanceOf(buyer.address)
    const parsedBalance = ethers.utils.formatUnits(balance, 'ether')

    expect(parsedBalance).to.equal('10.0')
  })

  it('Should create and execute sales', async function() {
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken('https://www.mytoken.com/1')
    await nft.createToken('https://www.mytoken.com/2')

    await market.createMarketItem(nftAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftAddress, 2, auctionPrice, { value: listingPrice })

    let itemsBeforeSell = await market.fetchMarketItems()
    expect(itemsBeforeSell.length).to.equal(2)

    await market.connect(buyer).createMarketSale(nftAddress, 1, { value: auctionPrice })

    let items = await market.fetchMarketItems()

    expect(items.length).to.equal(1)

    // items = await Promise.all(
    //   items.map(async i => {
    //     const tokenUri = await nft.tokenURI(i.tokenId)
    //     return {
    //       price: i.price.toString(),
    //       tokenId: i.tokenId.toString(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       tokenUri
    //     }
    //   })
    // )

    // console.log('store items: ', items)

    const itemsBought = await market.connect(buyer).fetchMyBoughtNFTs()
    expect(itemsBought.length).to.equal(1)

    // const readableItemsBought = await Promise.all(
    //   itemsBought.map(async i => {
    //     const tokenUri = await nft.tokenURI(i.tokenId)
    //     return {
    //       price: i.price.toString(),
    //       tokenId: i.tokenId.toString(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       tokenUri
    //     }
    //   })
    // )

    // console.log('items bought', readableItemsBought)

    const nftsFromSeller = await market.connect(owner).fetchMySellingNFTs()
    expect(nftsFromSeller.length).to.equal(1)

    // const readableNftsFromSeller = await Promise.all(
    //   nftsFromSeller.map(async i => {
    //     const tokenUri = await nft.tokenURI(i.tokenId)
    //     return {
    //       price: i.price.toString(),
    //       tokenId: i.tokenId.toString(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       tokenUri
    //     }
    //   })
    // )

    // console.log('items on sale from seller', readableNftsFromSeller)
  });
});
