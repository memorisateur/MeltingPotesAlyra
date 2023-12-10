'use client'

import ParticipantCard from './participantCard/page';

import { 
    Tabs, 
    Checkbox, 
    Box,
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
} from '@chakra-ui/react'

//wagmi
import { usePublicClient } from "wagmi";
import { prepareWriteContract, readContract, writeContract, waitForTransaction } from '@wagmi/core'

//react
import { useState, useEffect } from "react";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';

// Viem
import { parseAbiItem } from 'viem'


const AddParticipant = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

    //input for connecting instance address
    const [newParticipantAddress, setNewParticipantAddress] = useState('');
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantAllowed, setNewParticipantAllowed] = useState(false);

  
    const [participantAddedEvent, setParticipantAddedEvent] = useState([]);
  
    // Fonction pour exécuter getEvents au chargement de la page
    useEffect(() => {
      getEvents();
    }, []);
  
    //function add a voter
    const addParticipant = async() => {
      try {
        const { request } = await prepareWriteContract({
         address: instanceAddress,
         abi: meltingPotesContract.abi,
         functionName: 'addParticipant',
         args: [newParticipantAddress, newParticipantName, newParticipantAllowed],
        })
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash: hash,
        })
        
        // catch the event
        await getEvents();
  
        //reset value
        await setNewParticipantAddress('');
        await setNewParticipantName('');
        await setNewParticipantAllowed(false);
        await onClose();
        
        toast({
          title: 'Confirmation',
          description: "A new participant has been added.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      } catch(error) {
        console.log(error.message);
        let errorMessage = "An error occurred.";
  
        // Check the specific error message from the smart contract
        if (error.message.includes("You are not the administrator")) {
          errorMessage = "You are not the administrator";
        } else if (error.message.includes("The instance has ended")) {
          errorMessage = "The instance has ended";
        } else if (error.message.includes("this address is already registered")) {
          errorMessage = "this address is already registered";
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
        const participantAddedLogs = await publicClient.getLogs({  
          address: instanceAddress,
          event: parseAbiItem('event participantAdded(address userAddress, string name, bool authorizedToSpend)'),
    
          fromBlock: 0n,
          toBlock: 'latest'
        })
        setParticipantAddedEvent(participantAddedLogs.map(
          log => ({
            address: log.args.userAddress,
            name: log.args.name,
            allowed: log.args.authorizedToSpend
          })
        ))
        console.log(participantAddedEvent);
  
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


      const getMoneyDeposited = async(address) => {
        try {
            const data = await readContract({
                address: instanceAddress,
                abi: meltingPotesContract.abi,
                functionName: 'getMoneyDeposited',
                args: [address],
            })
            return data
        }   
        catch(err) {
            console.log(err.message)
        }
    }
    

  return (
    <div>
    <Box overflowX="overlay" >
      <Box flex='none'  overflowX="overlay" width="max-content" spacing={4} >
          {participantAddedEvent.map((participant, index) => {
            return <ParticipantCard 
            key={participant.address}
            address={participant.address}
            allowed={participant.allowed}
            depositeee={getMoneyDeposited(participant.address)}
            name={participant.name}
             />
              })}      
          </Box>
        </Box>


    <Button onClick={onOpen} colorScheme='orange' size='md' ml='4' mt='3' >Add participant</Button>

<Modal
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Add a new participant</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
    <FormControl>
        <FormLabel>Participant's name</FormLabel>
        <Input placeholder='name' value={newParticipantName} onChange={(e) =>
          setNewParticipantName(e.target.value) }/>
      </FormControl>
      <FormControl>
        <FormLabel>Participant's address</FormLabel>
        <Input placeholder='address' value={newParticipantAddress} onChange={(e) =>
          setNewParticipantAddress(e.target.value) }/>
      </FormControl>
      <FormControl>
        <Checkbox
        isChecked={newParticipantAllowed}
        onChange={() => setNewParticipantAllowed(!newParticipantAllowed)}
      >
        Allow spending
      </Checkbox>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={addParticipant}>
        Add
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default AddParticipant