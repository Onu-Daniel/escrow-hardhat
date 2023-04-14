// Import required packages and components
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import Header from './components/Header'
import Footer from './components/Footer'


// Connect to the user's Web3 provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Function to approve an escrow contract
export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

// Function to remove all escrow contracts from local storage
function clearLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('escrow_contract_')) {
      localStorage.removeItem(key);
    }
  }
}

// Main App component
function App() {
  // Set up state variables for escrow contracts, user account, and signer
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  
  // Use effect hook to get user accounts and stored escrow contracts
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();

     // Get stored escrow contracts from local storage
    const storedEscrows = Object.keys(localStorage).filter(key => key.startsWith('escrow_contract_')).map(key => JSON.parse(localStorage.getItem(key)));
    setEscrows(storedEscrows);
  }, [account]);

  
  // Function to deploy a new escrow contract
  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const ethValue = document.getElementById('eth').value; // Get the input in ether
    const value = ethers.utils.parseEther(ethValue); // Convert to wei
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

     // Create a new escrow object with contract details and approve function
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: ethers.utils.formatEther(value),
      handleApprove: async () => {
        // Listen for Approved event emitted by contract and update UI when approved
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        // Call approve function on contract
        await approve(escrowContract, signer);
      },
    };

    // Add new escrow to escrow list and store it in local storage

    setEscrows([...escrows, escrow]);

    localStorage.setItem('escrow_contract_' + escrowContract.address, JSON.stringify(escrow));
  }

  // Function to remove all escrow contracts
  function remove() {
    clearLocalStorage();
    setEscrows([]);
  }

  
  // Render the app UI
  return (    
    <div className='fullcontainer'>
      <Header />
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>
        <button className='button delete' onClick={remove}>Clear All</button>
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
