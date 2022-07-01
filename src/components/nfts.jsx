import Nullstack from 'nullstack'
import Drop from '../assets/drop'

import { ethers } from 'ethers'
import axios from 'axios'

import { nftAddress, nftMarketAddress } from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

class Nfts extends Nullstack {

  nfts = []

  hydrate() {
    this.loadNFTs()
  }

  async loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(
      data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
      })
    )

    this.nfts = items
  }

  renderNft({ data }) {
    return (
      <div class="border overflow-hidden p-2">
        <img src={data.image} />
        <div class="mt-2">
          <p class="text-sm font-bold">{data.name}</p>
          <div class="overflow-hidden">
            <p class="text-gray-400 text-xs">{data.description}</p>
          </div>
          <p class="text-xs mt-2">Price</p>
          <p class="text-sm font-bold text-white flex items-center">
            <Drop class="inline-block mr-2" />
            {data.price} ETH
          </p>
        </div>
      </div>
    )
  }

  render({ filter = '' }) {
    return (
      <div class="grid grid-cols-4 gap-4 p-4 mt-2">
        {
          this.nfts
            .filter(nft => (nft.name.indexOf(filter) > -1 || nft.description.indexOf(filter) > -1 || nft.price.toString().indexOf(filter) > -1))
            .map(nft => (<Nft data={nft} />))
        }
      </div>
    )
  }
}

export default Nfts
