# Nft Marketplace (WET TOKENS)

## Running the development environment

We need to start the ipfs and the blockchain node locally.

```
// ipfs
docker-compose up

// blockchain node
npm run dev-node
// the blockchain will give you some private keys with some ether to test, import at least two of them in your wallet (you can use meta mask chrome extension) to test.
```

After this you need to deploy the contracts to the blockchain node

```
npm run dev-deploy-contracts
```

Now we can start the nullstack server and tailwind build

```
// nullstack
npm start

// tailwind
npm run dev-tailwind
```

Go to the [admin](http://localhost:3000/admin/pictures/create) and mint* some nft's


* mint = create or register the digital asset inside the blockchain
