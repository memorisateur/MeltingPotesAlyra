'use client'
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Heading, 
    Text,
 } from '@chakra-ui/react'

const ParticipantCard = ({name, address, allowed, deposit}) => {
  return (
    <Card display='inline-block' border='1px' m='1rem' borderColor="gray" borderRadius='8px'>
    <CardHeader>
      <Heading size='md'> {name}</Heading>
    </CardHeader>
    <CardBody>
      <Text>{address}</Text>
      <Text >
        <br /> Allowed to spend ? 
        <Text fontSize={allowed ? 'lg' : 'md'} 
            color={allowed ? 'green' : 'red'}> {allowed ? 'YES' : 'NO'} 
        </Text>
      </Text>  
    </CardBody>
    <CardFooter>
    <Text> Total deposit : {deposit} eth
    </Text>  
    </CardFooter>
  </Card>
  )
}

export default ParticipantCard