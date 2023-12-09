'use client'
import {
    Button,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Flex,
    Divider,
    useToast,
  } from '@chakra-ui/react'

//wagmi
import { usePublicClient } from "wagmi";
import { prepareWriteContract, writeContract } from '@wagmi/core'

//react
import { useState, useEffect } from "react";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';



const EndInstanceNow = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()


// function to start proposal's registering
const endInstanceBefore = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: instanceAddress,
       abi: meltingPotesContract.abi,
       functionName: 'endInstanceBeforeDateOfExpire',
      })
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      })
      toast({
        title: 'Confirmation',
        description: "The instance has been ended and funds were sended back.",
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
    <>
    <Flex p='2rem' mb='2rem'>
    <Button colorScheme='red' onClick={onOpen}>End instance now</Button>
    </ Flex>
<Modal isOpen={isOpen} onClose={onClose}>
<ModalOverlay />
<ModalContent>
<ModalHeader>Warning</ModalHeader>
<ModalCloseButton />
<ModalBody>
  <Text>Warning : You are about to end the instance. The remaining funds will be sended back. 
    Are you sure you want to continue ?
  </Text>
</ModalBody>

<ModalFooter>
  <Button  variant='ghost' mr={3} onClick={onClose}>
    Cancel
  </Button>
  <Button  colorScheme='blue' onClick={endInstanceBefore }>Confirm</Button>
</ModalFooter>
</ModalContent>
</Modal>
<Divider />
</>
  )
}

export default EndInstanceNow