# Subspace Feed Manager

This is a Subspace DApp for interacting with the feeds pallet on a local development node.

- View feeds owned by any injected or development accounts
- Create new feeds
- Add data to a feed
- Close or transfer ownership to another account

## Libraries used

- [@polkadot/api](https://polkadot.js.org/api)
- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Chakra UI](https://chakra-ui.com)
- [React Table](https://tanstack.com/table)
- [Cypress](https://cypress.io)

## Commands

### Installation
```bash
# Due to issues with @polkadot/api type parsing, a modified subspace fork was used in development
git clone https://github.com/kwingram25/subspace ./subspace-fork
cd ./subspace-fork
cargo run --release --bin subspace-node -- --dev --tmp
cargo run --release --bin subspace-farmer farm --reward-address stB4S14whneyomiEa22Fu2PzVoibMB7n5PvBFUwafbCbRkC1K --plot-size 1G

cd ..
git clone https://github.com/kwingram25/subspace-dapp
cd ./subspace-dapp
yarn install
```

### Development

```bash
yarn dev 
# Deployed at http://localhost:3000
```

### E2E testing

```bash
# Must be run on a new node with no feeds created
yarn cypress run
# or yarn cypress open
```

### Start server
```bash
yarn build
yarn start
# Visit http://localhost:3000
```

