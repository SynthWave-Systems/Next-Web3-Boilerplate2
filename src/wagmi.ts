import { getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  oortMainnetDev,
} from "wagmi/chains";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error("Some ENV variables are not defined");
}

const { chains, publicClient } = configureChains(
  [oortMainnetDev],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://dev-rpc.oortech.com`,
      }),
    }),
  ],
)

const { wallets } = getDefaultWallets({
  appName: "Next-Web3-Boilerplate",
  projectId: walletConnectProjectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
