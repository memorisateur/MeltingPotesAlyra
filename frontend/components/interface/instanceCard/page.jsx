'use client'
import { 
     Card,
     CardHeader, 
     CardBody, 
     CardFooter,
     Heading,
     Text,
     Button,
    } from '@chakra-ui/react'

import { useInstanceAddress } from '@/constants/instanceAddress';


const InstanceCard = ({title, address}) => {

  //createInstance arguments
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();


    const connectAddress = async() => {
        await setInstanceAddress(address);
        await console.log(instanceAddress);
    }

  return (
    <Card align='center' mt='3rem' mr='2rem' ml='2rem' style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
  <CardHeader>
    <Heading size='md'> {title}</Heading>
  </CardHeader>
  <CardBody>
    <Text>{address}</Text>
  </CardBody>
  <CardFooter>
    <Button colorScheme='blue' onClick={connectAddress}>View here</Button>
  </CardFooter>
    </Card>
  )
}

export default InstanceCard