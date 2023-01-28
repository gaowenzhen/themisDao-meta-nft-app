import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import '../public/global.css';
// import { Provider } from "react-redux";
import {
  connectorsForWallets, getDefaultWallets, RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { argentWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// import store from './store';
// 正式环境就删除
import { currentChain ,ChainConfig} from "../config";
const { chains, provider, webSocketProvider } = configureChains(
  [currentChain,ChainConfig[97],ChainConfig[56],chain.sepolia, chain.goerli, chain.mainnet, chain.optimism, chain.polygonMumbai],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit Mint NFT Demo',
  chains,
});

const demoAppInfo = {
  appName: 'RainbowKit Mint NFT Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [argentWallet({ chains }), trustWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
       {/* <Provider store={store}> */}
        <Component {...pageProps} />
       {/* </Provider> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
