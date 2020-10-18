const port = process.env.HOST_PORT || 9090

module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243

Then, run the migration with:

  source .env && tronbox migrate --network mainnet

*/
      userFeePercentage: 100,
      feeLimit: 1e8,
      fullHost: 'https://api.trongrid.io',
      network_id: '1'
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY_SHASTA,
      userFeePercentage: 50,
      feeLimit: 1e8,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '2'
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_NILE,
      fullNode: 'https://httpapi.nileex.io/wallet',
      solidityNode: 'https://httpapi.nileex.io/walletsolidity',
      eventServer: 'https://eventtest.nileex.io',
      network_id: '3'
    },
    development: {
      // For trontools/quickstart docker image TFCcyLPnm2LcxGLjW1N11Z32cRe6gmkSYg
      privateKey: '1e8a95a1fce2d4358b0e53a3d4313ca59b31ae4e599a577a392d5e0e37154d61',
      userFeePercentage: 0,
      feeLimit: 1e8,
      fullHost: 'http://127.0.0.1:' + port,
      network_id: '9'
    },
    compilers: {
      solc: {
        version: '0.5.8'
      }
    }
  }
}
