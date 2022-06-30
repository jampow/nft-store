import Nullstack from 'nullstack';
import List from './list';

class Assets extends Nullstack {

  render() {
    return (
      <List route='/admin/assets/list' />
    )
  }

}

export default Assets;
