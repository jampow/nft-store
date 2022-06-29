import Nullstack from 'nullstack';
import List from './list';

class Admin extends Nullstack {

  render() {
    return (
      <>
        <List route='/admin/pictures/list' />
      </>
    )
  }

}

export default Admin;
