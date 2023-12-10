'use client'

import ConnectInstance from './connectInstance/page';
import CreateInstance from './createNewInstance/page';
import InstanceCard from './instanceCard/page';

// chakra
import {
  Text,
} from '@chakra-ui/react'


  //wagmi
  import { usePublicClient, useAccount } from 'wagmi'

  //viem
  import { parseAbiItem } from 'viem';

  // constants
  import { useInstanceAddedEvent } from '@/constants/instanceAddedEvent';

////////////////////////////////////////////
const Interface = () => {

  //public client wagmi
  const publicClient = usePublicClient();


  const {instanceAddedEvent, setInstanceAddedEvent} = useInstanceAddedEvent();


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