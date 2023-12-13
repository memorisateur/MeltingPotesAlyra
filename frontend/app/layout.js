'use client';
import { ChakraProvider } from '@chakra-ui/react'
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from 'wagmi';
import { wagmiConfig, chains } from "./wagmiConfig";
import { XMTPProvider } from "@xmtp/react-sdk";


//useContext
import { InstanceAddressProvider } from '@/constants/instanceAddress';
import { InstanceAddedEventProvider } from '@/constants/instanceAddedEvent';
import { EtherSpendedEventProvider } from '@/constants/etherSpendedEvent';

import Header from '@/components/header/page';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ChakraProvider>
      <XMTPProvider>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <InstanceAddressProvider>
              <InstanceAddedEventProvider>
                <EtherSpendedEventProvider>
                {children}
                </EtherSpendedEventProvider>
              </InstanceAddedEventProvider>
            </InstanceAddressProvider>
          </RainbowKitProvider>
        </WagmiConfig>
        </XMTPProvider>
      </ChakraProvider>
      </body>
    </html>
  )
}
