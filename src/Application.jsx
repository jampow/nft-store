import Nullstack from 'nullstack';
import Home from './pages/Home';
import Explore from './pages/Explore'
import Taps from './pages/Taps';
import Admin from './admin';

class Application extends Nullstack {

  prepare({ page }) {
    page.locale = 'pt-BR';
  }

  renderHead() {
    return (
      <head>
        <link
          href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet" />
        <link
          href="/output.css"
          rel="stylesheet" />
      </head>
    )
  }

  render() {
    return (
      <main class='w-full bg-black text-white'>
        <Head />
        <Home route="/" />
        <Explore route="/explore" />
        <Taps route="/taps" />
        <Admin route="/admin/*" />
      </main>
    )
  }

}

export default Application;
