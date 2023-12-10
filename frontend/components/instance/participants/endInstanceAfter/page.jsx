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

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';



const EndInstanceAfter = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Toast
  const toast = useToast()

    //modal
  const { isOpen, onOpen, onClose } = useDisclosure()


// function to start proposal's registering
const endInstanceAfter = async() => {
    try {
      const { request } = await prepareWriteContract({
       address: instanceAddress,
       abi: meltingPotesContract.abi,
       functionName: 'endInstanceAfterDateOfExpire',
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
      let errorMessage = "An error occurred.";
  
      // Check the specific error message from the smart contract
      if (error.message.includes("You are not in this instance")) {
        errorMessage = "You are not in this instance";
      }  else if (error.message.includes("the instance is still active")) {
        errorMessage = "the instance is still active";
      } else if (error.message.includes("Instance already ended")) {
        errorMessage = "Instance already ended";
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


  return (
    <>
    <Flex p='2rem'>
    <Button colorScheme='red' onClick={onOpen}>Get back funds</Button>
    </ Flex>
<Modal isOpen={isOpen} onClose={onClose}>
<ModalOverlay />
<ModalContent>
<ModalHeader>Warning</ModalHeader>
<ModalCloseButton />
<ModalBody>
  <Text>The remaining funds will be sended back. 
    Are you sure you want to continue ?
  </Text>
</ModalBody>

<ModalFooter>
  <Button  variant='ghost' mr={3} onClick={onClose}>
    Cancel
  </Button>
  <Button  colorScheme='blue' onClick={endInstanceAfter }>Confirm</Button>
</ModalFooter>
</ModalContent>
</Modal>
<Divider />
</>
  )
}

export default EndInstanceAfter