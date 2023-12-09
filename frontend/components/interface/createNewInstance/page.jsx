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

  // Viem
import { parseAbiItem, parseEther } from 'viem'

  // constants
  import { useInstanceAddress } from '@/constants/instanceAddress';
  import { useInstanceAddedEvent } from '@/constants/instanceAddedEvent';
  import { meltingPotesFactoryContract } from '@/constants/contract';

////////////////////////////////////////////
const CreateInstance = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //createInstance arguments
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();
  const {instanceAddedEvent, setInstanceAddedEvent} = useInstanceAddedEvent();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newTitle, setNewTitle] = useState('');
  const [newMinimumDeposit, setNewMinimumDeposit] = useState();
  const [newDateOfExpire, setNewDateOfExpire] = useState();
  const [newName, setNewName] = useState('');



  //function add a voter
  const createNewInstance = async() => {
    try {

      // Utiliser directement la valeur du champ de date (au format ISO)
      const dateOfExpireUnix = Math.floor(new Date(newDateOfExpire).getTime() / 1000);

      // Convertir la somme de minimumDeposit de Ether à Wei
      const minimumDepositWei = parseEther(newMinimumDeposit);

      const { request } = await prepareWriteContract({
       address: meltingPotesFactoryContract.contractAddress,
       abi: meltingPotesFactoryContract.abi,
       functionName: 'createMeltingPotesContracts',
       args: [newTitle, minimumDepositWei, dateOfExpireUnix, newName],
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      
      // catch the event
      await getEvents();
      console.log(instanceCreatedEvents)
      console.log(instanceAddedEvent)
      //add to the voter table
    //  await addVoterTable();
      //reset value
      await setNewTitle('')
      await setNewMinimumDeposit(0)
      await setNewDateOfExpire(0)
      await setNewName('')
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
      toast({
        title: 'Oh no...',
        description: "An error occured...",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  //Even States
  const [instanceCreatedEvents, setInstanceCreatedEvents] = useState([]);

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

      const instanceCreatedLogs = await publicClient.getLogs({  
        address: meltingPotesFactoryContract.contractAddress,
        event: parseAbiItem('event instanceCreated(address instanceAddress, string title, uint date, uint dateOfExpire, address administrator)'),
  
        fromBlock: 0n,
        toBlock: 'latest'
      })
      setInstanceCreatedEvents(instanceCreatedLogs.map(
        log => ({
          address: log.args.instanceAddress,
          date: log.args.date,
          dateOfExpire: log.args.dateOfExpire,
          administrator: log.args.administrator,
        })
      ))
      console.log(instanceCreatedEvents);

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

      <Button onClick={onOpen} colorScheme='teal' size='lg' ml='4' mt='3' >Create new instance</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new instance</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter instance's title</FormLabel>
              <Input placeholder='title' value={newTitle} onChange={(e) =>
                setNewTitle(e.target.value) }/>
              <FormLabel>Enter minimum deposit</FormLabel>
              <Input type="number" placeholder='eth' value={newMinimumDeposit} onChange={(e) =>
                setNewMinimumDeposit(e.target.value) }/>
              <FormLabel>Enter date of expire</FormLabel>
              <Input type="date" placeholder='date of expire' value={newDateOfExpire} onChange={(e) =>
                setNewDateOfExpire(e.target.value) }/>
              <FormLabel>Enter your name</FormLabel>
              <Input placeholder='name' value={newName} onChange={(e) =>
                setNewName(e.target.value) }/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createNewInstance}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </div>
  )
}

export default CreateInstance