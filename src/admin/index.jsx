import Nullstack from 'nullstack';
import Pictures from './pictures';

class Admin extends Nullstack {

  prepare({ page }) {
    page.locale = 'pt-BR';
  }

  render() {
    return (
      <Pictures route="/admin/pictures/*" />
    )
  }

}

export default Admin;
