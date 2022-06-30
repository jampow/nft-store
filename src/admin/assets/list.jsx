import Nullstack from 'nullstack';
import { ethers } from 'ethers'
import axios from 'axios'

import { nftAddress, nftMarketAddress } from '../../../config'

import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

class List extends Nullstack {

  nfts = []

  hydrate() {
    this.loadNFTs()
  }

  async loadNFTs({ Web3Modal }) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    const data = await marketContract.fetchMyNFTs()

    console.log('data', data)

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

    console.log('items', items)

    this.nfts = items
  }

  // async buyNft({ Web3Modal, nft }) {
  //   console.log('buyNft')
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)

  //   const signer = provider.getSigner()
  //   const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

  //   const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

  //   const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, { value: price })
  //   await transaction.wait()

  //   this.loadNFTs()
  // }

  render() {
    return (
      <div class="flex justify-center">
        <div class="px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              this.nfts.map(nft => (
                <div class="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} class="rounded" />
                  <div class="p-4 bg-black">
                    <p className="text-2xl font-semiboldy">{nft.name}</p>
                    <div className="overflow-hidden">
                      <p class="text-gray-400">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl mb-4 font-bold text-white">Price: {nft.price} ETH</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

}

export default List;