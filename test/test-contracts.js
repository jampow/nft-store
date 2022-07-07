const { ethers } = require('hardhat');
const { expect } = require('chai')

describe('NFT Market', function() {

  let market
  let marketAddress

  let wetTokens
  let wetTokensAddress

  let nft
  let nftAddress

  let owner
  let buyer

  beforeEach(async function() {
    [owner, buyer] = await ethers.getSigners()

    const WetTokens = await ethers.getContractFactory('WetTokens')
    wetTokens = await WetTokens.deploy()
    await wetTokens.deployed()
    wetTokensAddress = wetTokens.address

    const Market = await ethers.getContractFactory('NFTMarket');
    market = await Market.deploy(wetTokens.address);
    await market.deployed();
    marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    nftAddress = nft.address
  })

  it('should buy some wet Tokens', async function() {
    const amount = ethers.utils.parseEther('1.0')

    const transaction = await buyer.sendTransaction({
      to: wetTokens.address,
      value: amount
    })

    const balance = await wetTokens.balanceOf(buyer.address)
    const parsedBalance = ethers.utils.formatUnits(balance, 'ether')

    expect(parsedBalance).to.equal('10.0')
  })

  it('Should create and execute sales', async function() {
    // create some nfts
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('10', 'ether')

    await nft.createToken('https://www.mytoken.com/1')
    await nft.createToken('https://www.mytoken.com/2')

    await market.createMarketItemOld(nftAddress, 1, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItemOld(nftAddress, 2, 1, auctionPrice, { value: listingPrice })

    let itemsBeforeSell = await market.fetchMarketItems()
    expect(itemsBeforeSell.length).to.equal(2)

    // mint tokens
    const amount = ethers.utils.parseEther('10.0')

    const transaction = await buyer.sendTransaction({
      to: wetTokensAddress,
      value: amount
    })

    const balance = await wetTokens.balanceOf(buyer.address)
    const parsedBalance = ethers.utils.formatUnits(balance, 'ether')

    expect(parsedBalance).to.equal('100.0')

    // sell one item
    await wetTokens.connect(buyer).approve(marketAddress, auctionPrice)
    await market.connect(buyer).createMarketSale(nftAddress, 1, 1, { value: auctionPrice })

    // checks wettokens from buyer wallet
    const balanceAfterBuy = await wetTokens.balanceOf(buyer.address)
    const parsedBalanceAfterBuy = ethers.utils.formatUnits(balanceAfterBuy, 'ether')

    expect(parsedBalanceAfterBuy).to.equal('90.0')

    // checks wettokens from seller wallet
    const sellerBalance = await wetTokens.balanceOf(owner.address)
    const sellerParsedBalance = ethers.utils.formatUnits(sellerBalance, 'ether')

    expect(sellerParsedBalance).to.equal('10.0')

    // checks maket items count
    let items = await market.fetchMarketItems()

    expect(items.length).to.equal(1)

    /*
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
    */

    // checks my bought items list
    const itemsBought = await market.connect(buyer).fetchMyBoughtNFTs()
    expect(itemsBought.length).to.equal(1)

    /*
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
    */

    // checks nfts on sale
    const nftsFromSeller = await market.connect(owner).fetchMySellingNFTs()
    expect(nftsFromSeller.length).to.equal(1)

    /*
    const readableNftsFromSeller = await Promise.all(
      nftsFromSeller.map(async i => {
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

    console.log('items on sale from seller', readableNftsFromSeller)
    */
  });
});
