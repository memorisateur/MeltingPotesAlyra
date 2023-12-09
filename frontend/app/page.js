'use client'
import Welcome from '@/components/welcome/page';
import Header from '@/components/header/page';
import Interface from '@/components/interface/page';
import Footer from '@/components/footer/page';
import Instance from '@/components/instance/page';

// wagmi
import { useAccount } from 'wagmi';

//react
import { useState, useEffect } from "react";

// constants
import { useInstanceAddress } from '@/constants/instanceAddress';

export default function Home() {

  //constants 
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // check if the user is connected
  const { address, isConnected, onDisconnect } = useAccount()


  return (
    <>
    {isConnected ? (
      <>
      {instanceAddress != '' ?(
      <>
      <Header />
      <Instance />
      <Footer />
      </>
      ) : (
        <>
        <Header />
        <Interface />
        <Footer />  
        </>
      )}
      </>
    ) :(
     <Welcome/>
    )}
    </>

  );
}
