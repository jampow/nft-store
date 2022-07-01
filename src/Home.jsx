import Nullstack from 'nullstack';
import Topbar from './components/topbar'

class Home extends Nullstack {

  prepare({ page }) {
    page.title = `NFTS for starving children`;
    page.description = `Buy a NFT and help starving children`;
  }

  renderLink({ children, href }) {
    const link = href + '?ref=create-nullstack-app';
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  render({ project }) {
    return (
      <section>
        <Topbar />
      </section>
    )
  }

}

export default Home;
