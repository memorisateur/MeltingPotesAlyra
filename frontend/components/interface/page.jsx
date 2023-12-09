'use client'

import ConnectInstance from './connectInstance/page';
import CreateInstance from './createNewInstance/page';
import InstanceCard from './instanceCard/page';

// chakra
import {
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react'

  //react
  import { useState, useEffect } from "react";

  //wagmi
  import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
  import { usePublicClient, useAccount } from 'wagmi'

  //viem
  import { parseAbiItem } from 'viem';

  // constants
  import { useInstanceAddress } from '@/constants/instanceAddress';
  import { useInstanceAddedEvent } from '@/constants/instanceAddedEvent';
  import { meltingPotesFactoryContract } from '@/constants/contract';

////////////////////////////////////////////
const Interface = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //constants 
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();
  const {instanceAddedEvent, setInstanceAddedEvent} = useInstanceAddedEvent();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newInstanceAddress, setNewInstanceAddress] = useState('');

  // wagmi
  const { address, isConnected } = useAccount();



  return (
    <div>

    <CreateInstance />
    <ConnectInstance />

    {instanceAddedEvent && instanceAddedEvent.length > 0 ? (
        instanceAddedEvent
        .filter((instance) => instance.user === address)
        .map((instance) => {
          return <InstanceCard key={instance.address}
           address={instance.address} 
          title={instance.title}  /> 
        })

      ) : (
        <>
    <Text>No instance added yet.</Text>
      </>
      )
    }

    </div>
  )
}

export default Interface