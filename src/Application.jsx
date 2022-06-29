import Nullstack from 'nullstack';
import './Application.css';
import Home from './Home';
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
      <main>
        <Head />
        <Home route="/" />
        <Admin route="/admin/*" />
      </main>
    )
  }

}

export default Application;
