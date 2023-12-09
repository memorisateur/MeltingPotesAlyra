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

//viem
import { parseEther } from 'viem';


const DepositMoney = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  //input for connecting instance address
  const [newMoneyDeposited, setNewMoneyDeposited] = useState(0);



  //function add a voter
  const depositMoney = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: instanceAddress,
       abi: meltingPotesContract.abi,
       functionName: 'depositMoney',
       value: parseEther(newMoneyDeposited),
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      

      //reset value
      await setNewMoneyDeposited(0);
      await onClose();
      
      toast({
        title: 'Confirmation',
        description: "Your funds have been received.",
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

    
  return (
    <div>
      <Button onClick={onOpen} colorScheme='teal' size='md' ml='7' mt='3' >Deposit money</Button>

<Modal
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Deposit money in the instance</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
    <FormControl>
        <FormLabel>Deposit amount</FormLabel>
        <Input placeholder='eth' value={newMoneyDeposited} onChange={(e) =>
          setNewMoneyDeposited(e.target.value) }/>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={depositMoney}>
        Deposit
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  )
}

export default DepositMoney