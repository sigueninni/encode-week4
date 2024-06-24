import { useEffect, useState } from "react";
import { useAccount, useBalance, useReadContract, useSignMessage } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon,BeakerIcon  } from "@heroicons/react/24/outline";

export const ContractInfo = () => {
  const { address, isConnecting, isDisconnected, chain } = useAccount();

  if (address) {
    return (
      <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
        <ApiData address={address as `0x${string}`}/>
      </div>
    );
  }

  if (isConnecting) {
    <div>Still connecting...</div>;
  }
  if (isDisconnected) {
    <div>No longer connected</div>;
  }
};

export const Chain = () => {
  const { chain } = useAccount()
  if (chain) return (
<LowerModule Icon={ <BeakerIcon className="h-8 w-8 fill-secondary" />}> <div>This is the current connected chain: <b>{chain?.name}</b></div></LowerModule>  
)
return null
};

export const LowerModule = ({Icon, children}) => {
  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
         <div> {Icon}</div>
    <p>
    {children}
    </p>
  </div>
  )
}

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card  bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">API Coupling</h2>
        <TokenAddressFromApi></TokenAddressFromApi>
        <RequestTokens address={params.address}></RequestTokens>
      </div>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.result}</p>
    </div>
  );
}

function RequestTokens(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then(res => res.json())
            .then(data => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Request tokens
      </button>
    );

  return (
    <div>
      <p>Result from API: {data.result ? "worked" : "failed"}</p>
    </div>
  );
}

// contract-address
// mint-tokens

// token-name
// total-supply
// token-balance/:address
// transaction-receipt
// server-wallet-address
// check-minter-role

// vote-delegate
// cast-vote
// get-winning-proposal
