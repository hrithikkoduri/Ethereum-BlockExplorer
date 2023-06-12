import { Alchemy, Network } from 'alchemy-sdk';
import React, { Component } from 'react';
import Layout from './components/Layout';
import { Card } from 'semantic-ui-react';
 
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

class App extends Component {
  state = {
    blockNumber: '',
    transactions: [],
    last5Blocks: [],
  };

  async componentDidMount() {
    const blockNumber = await alchemy.core.getBlockNumber();
    const { transactions } = await alchemy.core.getBlockWithTransactions(blockNumber);
    const last5Blocks = await this.fetchLast5Blocks(blockNumber);
    this.setState({ blockNumber, transactions, last5Blocks });
  }

  fetchLast5Blocks = async (latestBlockNumber) => {
    const blocks = [];

    for (let i = latestBlockNumber; i > latestBlockNumber - 5; i--) {
      const block = await alchemy.core.getBlock(i);
      console.log(block.number);
      blocks.push(block.number);
    }

    const items = blocks.map((block) => {
      return {
        header : 'Block Number :',
        description :  <p key={block}> {block}</p>,
        style: { overflowWrap: 'break-word '},
        fluid: true
      }
    });

    return <Card.Group items={items}/>
  };

  render() {
    const { blockNumber, transactions, last5Blocks } = this.state;
    if (!blockNumber || !transactions || !last5Blocks) {
      return <div>Loading...</div>;
    }
    return (
      <Layout>      
        <div className="App">
          <h1>Last 5 Blocknumbers:</h1>
          {last5Blocks}
         <br></br>
          <h2>Latest Block Number: {blockNumber}</h2>
          <hr></hr>
          <h2>Transactions on {blockNumber}:</h2>
          <ol>
            {transactions.map((transaction) => (
              <li key={transaction.hash}>{transaction.hash}</li>
            ))}
          </ol> 
      </div>
      </Layout>
    );
  }
}

export default App;
