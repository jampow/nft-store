import Nullstack from 'nullstack'
import { ethers } from 'ethers'

import { nftAddress, nftMarketAddress } from '../../../config'

import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

class CreatePicture extends Nullstack {

  price = ''
  name = ''
  description = ''
  fileUrl = ''

  async onChange({ event, ipfsClient }) {
    const file = event.target.files[0]
    try {
      const added = await ipfsClient.add(file, {
        progress: (prog) => console.log('received ', prog)
      })
      const url = `http://localhost:8080/ipfs/${added.path}`
      this.fileUrl = url
    } catch (e) {
      console.error(e)
    }
  }

  async createItem({ ipfsClient }) {
    if (!this.name || !this.description || !this.price || !this.fileUrl) return

    const data = JSON.stringify({
      name: this.name, description: this.description, image: this.fileUrl
    })

    try {
      const added = await ipfsClient.add(data)
      const url = `http://localhost:8080/ipfs/${added.path}`
      this.createSale({ url })
    } catch (e) {
      console.error(e)
    }
  }

  async createSale({ router, Web3Modal, url }) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const nftContract = new ethers.Contract(nftAddress, NFT.abi, signer)
    const transaction = await nftContract.createToken(url)
    const tx = await transaction.wait()


    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(this.price, 'ether')

    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    let listingPrice = await marketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    const marketTransaction = await marketContract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice })
    await marketTransaction.wait()

    router.path = '/admin/pictures/list'
  }

  render() {
    return (
      <div class="flex justify-center">
        <div class="w-1/2 flex flex-col pb-12">
          <input
            placeholder="name"
            class="mt-8 border p-4 bg-black focus:outline-none border-0 border-b-white border-b-2"
            type="text"
            bind={this.name}
          />
          <textarea
            placeholder="description"
            class="mt-2 border p-4 bg-black focus:outline-none border-0 border-b-white border-b-2"
            type="text"
            bind={this.description}
          />
          <input
            placeholder="price in Ether"
            class="mt-2 border p-4 bg-black focus:outline-none border-0 border-b-white border-b-2"
            type="text"
            bind={this.price}
          />
          <input
            placeholder="file"
            class="block w-full text-sm text-gray-400
              file:mt-4 file:mr-4 file:py-2 file:px-4
              file:border-0 
              file:text-sm file:font-semibold
              file:bg-black file:text-yellow-500
              hover:file:cursor-pointer"
            type="file"
            onchange={this.onChange}
          />
          {this.fileUrl && <img src={this.fileUrl} />}
          <button
            class="font-bold mt-4 bg-yellow-500 text-black p-4 shadow-lg"
            onclick={this.createItem}
          >
            Create asset
          </button>
        </div>
      </div>
    )
  }

}

export default CreatePicture;
