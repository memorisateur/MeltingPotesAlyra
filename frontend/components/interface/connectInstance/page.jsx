'use client'

// chakra
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Heading,
} from '@chakra-ui/react'

  //react
  import { useState, useEffect } from "react";

  //wagmi
  import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
  import { usePublicClient } from 'wagmi'

  //viem
  import { parseAbiItem } from 'viem';

  // constants
  import { useInstanceAddress } from '@/constants/instanceAddress';
  import { useInstanceAddedEvent } from '@/constants/instanceAddedEvent';
  import { meltingPotesFactoryContract } from '@/constants/contract';

////////////////////////////////////////////
const ConnectInstance = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();
  const {instanceAddedEvent, setInstanceAddedEvent} = useInstanceAddedEvent();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newInstanceAddress, setNewInstanceAddress] = useState('');

  // Fonction pour exécuter getEvents au chargement de la page
  useEffect(() => {
    getEvents();
  }, []);

  //function add a voter
  const connectToInstance = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: meltingPotesFactoryContract.contractAddress,
       abi: meltingPotesFactoryContract.abi,
       functionName: 'connectToInstance',
       args: [newInstanceAddress],
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      
      // catch the event
      await getEvents();
      console.log(instanceAddedEvent)

      //reset value
      await setNewInstanceAddress('')
      await onClose();
      
      toast({
        title: 'Confirmation',
        description: "A new instance has been added.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch(error) {
      console.log(error.message);
      let errorMessage = "An error occurred.";
  
      // Check the specific error message from the smart contract
      if (error.message.includes("You have reached the maximum amount of instances per user")) {
        errorMessage = "You have reached the maximum amount of instances per user";
      } else if (error.message.includes("this address is not one of the smart contract's instance")) {
        errorMessage = "this address is not one of the smart contract's instance";
      } else if (error.message.includes("this instance is already registered")) {
        errorMessage = "this instance is already registered";
      } else if (error.message.includes("you are not allowed in this instance")) {
        errorMessage = "you are not allowed in this instance";
      } 
      toast({
        title: 'Oh no...',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

    //function get all the events with viem
    const getEvents = async() => {
      try {
      const instanceAddedLogs = await publicClient.getLogs({  
        address: meltingPotesFactoryContract.contractAddress,
        event: parseAbiItem('event instanceAdded(address instanceAddress, address user, string title)'),
  
        fromBlock: 0n,
        toBlock: 'latest'
      })
      setInstanceAddedEvent(instanceAddedLogs.map(
        log => ({
          address: log.args.instanceAddress,
          user: log.args.user,
          title: log.args.title,
        })
      ))
      console.log(instanceAddedEvent);

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

      <Button onClick={onOpen} colorScheme='teal' size='lg' ml='4' mt='3' >Connect to an instance</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to an instance</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter instance's address</FormLabel>
              <Input placeholder='instance address' value={newInstanceAddress} onChange={(e) =>
                setNewInstanceAddress(e.target.value) }/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={connectToInstance}>
              Connect
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )
}

export default ConnectInstance