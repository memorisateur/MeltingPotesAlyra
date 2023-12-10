import {
    Tbody,
    Tr,
    Td,

  } from '@chakra-ui/react'


const HistoryCard = ({date, amount, from, to, description}) => {
  return (
    <Tbody>
          <Tr>
            <Td isNumeric>{date}</Td>
            <Td isNumeric>{amount}</Td>
            <Td >{from} <br /> {to}</Td>
            <Td >{description}</Td>
            <Td></Td>
          </Tr>
    </Tbody>
  )
}

export default HistoryCard