import {useEffect, useRef, useState} from 'react'
import viteLogo from './assets/gsn-green-vector.svg'
import './App.css'

import { BrowserProvider, Contract } from 'ethers'
import { RelayProvider } from '@opengsn/provider'

import { PaymasterType } from '@opengsn/common'

const targetFunctionAbiEntry = {
    "inputs": [],
    "name": "captureTheFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}

const PermitERC20UniswapV3Paymaster = PaymasterType.PermitERC20UniswapV3Paymaster
const Erc2771RecipientAddress = '0xC1BB94Fd100FD7b38f4353e6BF48F4DAc9987611'

async function connect() {
  // @ts-ignore
  const injected = (window as any).ethereum
  if (injected) {
    await injected.request({ method: "eth_requestAccounts" });
  } else {
    console.log("No MetaMask wallet to connect to");
  }
}

function App() {
  const [ready, setReady] = useState(false)

  const contract = useRef<Contract | null>(null)

  connect()
  useEffect(() => {
    // @ts-ignore

    const ethereum = window.ethereum;
    const ethersProvider = new BrowserProvider(ethereum)
      RelayProvider.newEthersV6Provider({
      provider: ethersProvider,
      config: {
        paymasterAddress: PermitERC20UniswapV3Paymaster
      }
    }).then(
      ({gsnSigner}) => {
        console.log('RelayProvider init success')
        contract.current = new Contract(Erc2771RecipientAddress, [targetFunctionAbiEntry], gsnSigner)
        setReady(true)
      })
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
        </a>
      </div>
      <h1>Transfer Tokens with GSN (on Goerli)</h1>
      <div className="card">
          {
              ready ? (
                <div>
                  <input type="text" placeholder="Recipient Address" id="recipientAddress" />
                  <input type="number" placeholder="Token Amount" id="tokenAmount" />
                  <input type="number" placeholder="Token Address" id="tokenAddress" />
                  <button

                    onClick={async () => {
                      // @ts-ignore

                      const recipientAddress = document.getElementById("recipientAddress").value;
                      // @ts-ignore

                      const tokenAmount = parseInt(document.getElementById("tokenAmount").value);
                      // @ts-ignore

                      const tokenAddress = parseInt(document.getElementById("tokenAddress").value);

                      if (!recipientAddress) {
                        alert("Please enter a valid recipient address.");
                        return;
                      }
            
                      if (!tokenAmount) {
                        alert("Please enter a valid token amount.");
                        return;
                      }

                      await contract.current?.transferTokens(recipientAddress, tokenAddress, tokenAmount)
                      ;
                    }}
                  >
                    Transfer Tokens
                  </button>
                </div>
              ) : <div> Initializing GSN Provider</div>
          }
        <p>
          Proof of concept frontend for GSN allowing a user to transfer tokens and pay gas with ERC20 token.
        </p>
      </div>
      
      <p className="read-the-docs">
        Open Developer Tools for logs, connect MetaMask account and select Goerli network to make a GSN transaction.
      </p>
    </>
  )
}

export default App
