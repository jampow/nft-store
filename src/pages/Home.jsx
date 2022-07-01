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
        <NFTS />
      </>
    )
  }

}

export default Home;
