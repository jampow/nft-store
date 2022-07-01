import Nullstack from 'nullstack';
import Topbar from '../components/topbar'
import NFTS from '../components/nfts'
import Magnifier from '../assets/magnifier'

class Home extends Nullstack {

  searchTerm = ''

  prepare({ page }) {
    page.title = `NFTS for starving children`;
    page.description = `Buy a NFT and help starving children`;
  }

  renderSearchbar() {
    return (
      <div class="mt-4 flex justify-center">
        <div class="bg-black border-b-2">
          <Magnifier class='inline-block mr-2' size='14' />
          <input class="bg-black focus:outline-none w-72" type='text' bind={this.searchTerm} />
        </div>
      </div>
    )
  }

  render({ project }) {
    return (
      <>
        <Topbar />
        <h1 class='text-center font-bold text-2xl'>Explore the starving children</h1>
        <Searchbar />
        <NFTS filter={this.searchTerm} />
      </>
    )
  }

}

export default Home;
