import Nullstack from 'nullstack';
import Pictures from './pictures';
import Assets from './assets';
import AdminTopbar from './components/AdminTopbar'

class Admin extends Nullstack {

  prepare({ page }) {
    page.locale = 'pt-BR';
  }

  render() {
    return (
      <>
        <AdminTopbar />
        <Pictures route="/admin/pictures/*" />
        <Assets route="/admin/assets/*" />
      </>
    )
  }

}

export default Admin;
