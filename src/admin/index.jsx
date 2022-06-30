import Nullstack from 'nullstack';
import Pictures from './pictures';
import Assets from './assets';

class Admin extends Nullstack {

  prepare({ page }) {
    page.locale = 'pt-BR';
  }

  render() {
    return (
      <>
        <Pictures route="/admin/pictures/*" />
        <Assets route="/admin/assets/*" />
      </>
    )
  }

}

export default Admin;
