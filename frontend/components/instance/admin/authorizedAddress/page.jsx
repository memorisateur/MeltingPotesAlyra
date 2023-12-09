'use client'

import AddressCard from './addressCard/page'
import TitleCard from './titleCard/page'

import { 
    Tabs, 
    TabList, 
    TabPanels,
    Button, 
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Tab,
    TabPanel,
} from '@chakra-ui/react'

//wagmi
import { usePublicClient } from "wagmi";
import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'

//react
import { useState, useEffect } from "react";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';

// Viem
import { parseAbiItem } from 'viem'


const AuthorizedAddress = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newTitleAuthAddress, setNewTitleAuthAddress] = useState('');
  const [newAddressAuthAddress, setNewAddressAuthAddress] = useState('');

  const [addressAuthorizedEvent, setAddressAuthorizedEvent] = useState([]);

  // Fonction pour exécuter getEvents au chargement de la page
  useEffect(() => {
    getEvents();
  }, []);

  //function add a voter
  const addAuthAddress = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: instanceAddress,
       abi: meltingPotesContract.abi,
       functionName: 'addAuthorizedAddress',
       args: [newAddressAuthAddress, newTitleAuthAddress],
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      
      // catch the event
      await getEvents();

      //reset value
      await setNewAddressAuthAddress('');
      await setNewTitleAuthAddress('');
      await onClose();
      
      toast({
        title: 'Confirmation',
        description: "A new address has been authorized.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch(error) {
      console.log(error.message);
      toast({
        title: 'Oh no...',
        description: "An error occured...",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

    //function get all the events with viem
    const getEvents = async() => {
      try {
      const addressAuthorizedLogs = await publicClient.getLogs({  
        address: instanceAddress,
        event: parseAbiItem('event addressAuthorized(address indexed newAddress, string name)'),
  
        fromBlock: 0n,
        toBlock: 'latest'
      })
      setAddressAuthorizedEvent(addressAuthorizedLogs.map(
        log => ({
          address: log.args.newAddress,
          name: log.args.name,
        })
      ))
      console.log(addressAuthorizedEvent);

      } catch(error) {
        console.log(error.message);
        toast({
          title: 'Oh no...',
          description: "An error occured...",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    }
    
  return (
    <div>
      <Button onClick={onOpen} colorScheme='orange' size='md' ml='7' mt='3' >Add authorized Address</Button>

<Modal
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Add a new authorized address</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
    <FormControl>
        <FormLabel>Name of the address</FormLabel>
        <Input placeholder='name' value={newTitleAuthAddress} onChange={(e) =>
          setNewTitleAuthAddress(e.target.value) }/>
      </FormControl>
      <FormControl>
        <FormLabel>Enter address</FormLabel>
        <Input placeholder='address' value={newAddressAuthAddress} onChange={(e) =>
          setNewAddressAuthAddress(e.target.value) }/>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={addAuthAddress}>
        Add
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

<Tabs mb='3rem'ml='3rem' mr='3rem' mt='1rem' >
  <TabList>
  {addressAuthorizedEvent && addressAuthorizedEvent.length > 0 ? (
        addressAuthorizedEvent
        .map((authAddress) => {
          return   <TitleCard 
          key={authAddress.name}
          title={authAddress.name}/> 
        })

      ) : (
        <>
        <Tab>.</Tab>
      </>
      )
    }
  </TabList>

  <TabPanels>
  {addressAuthorizedEvent && addressAuthorizedEvent.length > 0 ? (
        addressAuthorizedEvent
        .map((authAddress) => {
          return   <AddressCard 
          key={authAddress.address}
          address={authAddress.address}/> 
        })

      ) : (
        <>
            <TabPanel>
          <p>No restriction</p>
          </TabPanel>
      </>
      )
    }
  </TabPanels>
</Tabs>
    </div>
  )
}

export default AuthorizedAddress