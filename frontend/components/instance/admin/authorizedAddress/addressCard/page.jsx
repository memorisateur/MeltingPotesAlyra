'use client'
import { 
  TabPanel 
} from '@chakra-ui/react'

const AddressCard = ({address}) => {
  
  return (
    <TabPanel>
    <p>{address}</p>
  </TabPanel>
  )
}

export default AddressCard