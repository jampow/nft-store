import Nullstack from 'nullstack';
import Application from './src/Application';
import { create } from 'ipfs-http-client'
import Web3Modal from 'web3modal'

const context = Nullstack.start(Application);

context.start = async function start() {
  context.ipfsClient = create('http://localhost:5001/api/v0')
  context.Web3Modal = Web3Modal
}

export default context;
