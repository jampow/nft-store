import Nullstack from 'nullstack';
import List from './list';
import Create from './create';

class Admin extends Nullstack {

  render() {
    return (
      <>
        <List route='/admin/pictures/list' />
        <Create route='/admin/pictures/create' />
      </>
    )
  }

}

export default Admin;
