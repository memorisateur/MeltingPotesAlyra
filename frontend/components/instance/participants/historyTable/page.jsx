'use client'
import {useState} from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Box,
    TableContainer,
    Heading,
  } from '@chakra-ui/react'

// Viem
import { formatEther, parseEther } from 'viem'

import HistoryCard from './historyCard/page';

//constant
import { useEtherSpendedEvent } from '@/constants/etherSpendedEvent';


const HistoryTable = () => {

    const {etherSpendedEvent, setEtherSpendedEvent} = useEtherSpendedEvent();


    // Fonction pour formater la date
    const formatDate = (timestamp) => {
    // Convertir le BigInt en Number
    const timestampAsNumber = Number(timestamp);
  
    const date = new Date(timestampAsNumber * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
    const year = date.getFullYear();
  
    // Ajouter un 0 au jour et au mois si nécessaire
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
    };

  return (
    <div>
        <Heading as='h1' p="2rem">
        History of spendings :
        </Heading>
        <TableContainer p="1rem">
    <Table variant='striped' colorScheme='gray'>
      <Thead>
        <Tr >
          <Th alignContent='left' isNumeric  style={{ backgroundColor: '#008080', color: 'white' }}><Box ml='-20px'>Date</Box></Th>
          <Th isNumeric   style={{ backgroundColor: '#008080', color: 'white' }}><Box ml='-10px'>Amount</Box></Th>
          <Th  style={{ backgroundColor: '#008080', color: 'white' }}>from: <br/> to:</Th>
          <Th style={{ backgroundColor: '#008080', color: 'white' }}></Th>
          <Th style={{ backgroundColor: '#008080', color: 'white' }}>Description</Th>
        </Tr>
      </Thead>

      {etherSpendedEvent && etherSpendedEvent.length > 0 ? (
        etherSpendedEvent.map((transaction) => {
          return <HistoryCard key={transaction.date} date={formatDate(transaction.date)} 
          amount={formatEther(transaction.amount)} 
          from={transaction.from} 
          to={transaction.to} 
          description={transaction.description} /> 
        })

      ) : (
        <>
        <Tbody>
        <Tr>
          <Td isNumeric></Td>
          <Td isNumeric></Td>
          <Td>No expense yet</Td>
          <Td ></Td>
          <Td ></Td>
        </Tr>
      </Tbody>
      </>
      )
    }

    </Table>
  </TableContainer>
  </div>
  )
}

export default HistoryTable;