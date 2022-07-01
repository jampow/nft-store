import Nullstack from 'nullstack';
import Topbar from '../components/topbar'
import NFTS from '../components/nfts'

class Home extends Nullstack {

  prepare({ page }) {
    page.title = `NFTS for starving children`;
    page.description = `Buy a NFT and help starving children`;
  }

  render({ project }) {
    return (
      <>
        <Topbar />
        <div class="w-full">
          <h2 class="text-xl font-bold">Trending NFTs</h2>
          <NFTS />
        </div>
      </>
    )
  }

}

export default Home;
