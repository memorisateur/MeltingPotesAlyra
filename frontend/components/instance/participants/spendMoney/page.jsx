'use client'

import { 
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
import { useEtherSpendedEvent } from '@/constants/etherSpendedEvent';

// Viem
import { parseAbiItem, parseEther } from 'viem'



const SpendMoney = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newMoneySpended, setNewMoneySpended] = useState(0);
  const [newMoneySpendedAddress, setNewMoneySpendedAddress] = useState('');
  const [newMoneySpendedDescription, setNewMoneySpendedDescription] = useState('');

  const {etherSpendedEvent, setEtherSpendedEvent} = useEtherSpendedEvent();

  // Fonction pour exécuter getEvents au chargement de la page
  useEffect(() => {
    getEvents();
  }, []);

  //function add a voter
  const spendMoney = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: instanceAddress,
       abi: meltingPotesContract.abi,
       functionName: 'spendMoney',
       args: [parseEther(newMoneySpended), newMoneySpendedAddress, newMoneySpendedDescription],
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      

      //reset value
      await setNewMoneySpended(0);
      await setNewMoneySpendedAddress('');
      await setNewMoneySpendedDescription('');
      await onClose();
      
      toast({
        title: 'Confirmation',
        description: "Transaction success.",
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
      const etherSpendedLogs = await publicClient.getLogs({  
        address: instanceAddress,
        event: parseAbiItem('event EtherSpended(uint date, uint amount, address indexed from, address indexed to, string description)'),

        fromBlock: 0n,
        toBlock: 'latest'
      })
      setEtherSpendedEvent(etherSpendedLogs.map(
        log => ({
          date: log.args.date,
          amount: log.args.amount,
          from: log.args.from,
          to: log.args.to,
          description: log.args.description,
        })
      ))
      console.log(etherSpendedEvent);

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
      <Button onClick={onOpen} colorScheme='teal' size='md' ml='7' mt='3' p='1rem' >Send money</Button>

<Modal
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Send money</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
    <FormControl>
        <FormLabel>amount</FormLabel>
        <Input placeholder='eth' value={newMoneySpended} onChange={(e) =>
          setNewMoneySpended(e.target.value) }/>
      </FormControl>
      <FormControl>
        <FormLabel>to</FormLabel>
        <Input placeholder='address' value={newMoneySpendedAddress} onChange={(e) =>
          setNewMoneySpendedAddress(e.target.value) }/>
      </FormControl>
      <FormControl>
        <FormLabel>info receiver</FormLabel>
        <Input placeholder='description' value={newMoneySpendedDescription} onChange={(e) =>
          setNewMoneySpendedDescription(e.target.value) }/>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={spendMoney}>
        Spend
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  )
}

export default SpendMoney