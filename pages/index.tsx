import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NFT_ABI, NFT_CONTRACT_ADDRESS } from "../assets/config";
import { ethers } from "ethers";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export default function Index(): JSX.Element {
  const [name, setName] = useState<string>("");

  const {
    activate,
    active,
    library: provider,
    account,
    chainId,
  } = useWeb3React();

  useEffect(() => {
    if (active) {
      if (chainId != 4) {
        setName("You should be on the rinkeby network");
      } else {
        setName(account != undefined ? account : "");
      }
    }
  }, [active]);

  async function connect() {
    try {
      await activate(injected);
    } catch (e) {
      console.log(e);
    }
  }
  async function mint() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const cost = await contract.cost();
    const mintAmount = 1;
    const options = {value: cost}
    const mint = await contract.mint(mintAmount, options);

    alert(mint)
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
        <div id="details">{name}</div>
        <div className="flex">
          <button
            className="px-4 py-2 rounded-md bg-admin-blue cursor-pointer text-xl font-semibold duration-100 text-white mr-5"
            onClick={() => connect()}
          >
            Connect Wallet
          </button>
          <button
            className="px-4 py-2 rounded-md bg-admin-blue cursor-pointer text-xl font-semibold duration-100 text-white"
            onClick={() => mint()}
          >
            Mint
          </button>
        </div>
      </div>
    </>
  );
}
