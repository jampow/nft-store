import Nullstack from 'nullstack';
import Fancybox from '../../components/fancybox'
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

  async buyNft({ Web3Modal, nft }) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, { value: price })
    await transaction.wait()

    this.loadNFTs()
  }

  render() {
    return (
      <div class="flex justify-center">
        <div class="px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              this.nfts.map(nft => {
                return (
                  <Fancybox data={nft}>
                    <button class="w-full bg-yellow-500 text-black font-bold py-2 px-12 rounded" onclick={() => this.buyNft({ nft })}>Buy</button>
                  </Fancybox>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default List;
