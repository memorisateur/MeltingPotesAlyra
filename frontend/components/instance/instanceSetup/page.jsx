'use client'
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Text,
    Box,
    Heading,
    Stack,
    StackDivider,
} from '@chakra-ui/react'

// Viem
import { formatEther, parseEther } from 'viem'

//wagmi
import { usePublicClient } from "wagmi";
import { prepareWriteContract, readContract } from '@wagmi/core'

//react
import { useState, useEffect } from "react";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';

const InstanceSetup = () => {

    //public client wagmi
    const publicClient = usePublicClient();

      //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

    // Balance of the instance
    const [balance, setBalance] = useState(0)

    // Total sended of the instance
    const [totalBalance, setTotalBalance] = useState(0)

    // Minimum deposit of the instance
    const [minimumDeposit, setMinimumDeposit] = useState(0)

    // Date of expire of the instance
    const [dateOfExpire, setDateOfExpire] = useState(0)

    // Status of the instance
    const [status, setStatus] = useState('')

    // Title of the instance
    const [title, setTitle] = useState('')



useEffect(() => {
    const updateInstance = async () => {

      setBalance(await getBalanceInstance());
      setTotalBalance(await getTotalBalanceInstance());
      setTitle(await getTitleInstance());
      setMinimumDeposit(await getMinimumDepositInstance());
      console.log(minimumDeposit);
      setDateOfExpire(await getDateOfExpireInstance());
      setStatus(await getStatusInstance());
    };

    updateInstance()
  }, [publicClient]);

 // Get the balance of the user
 const getBalanceInstance = async() => {
     try {
         const data = await readContract({
             address: instanceAddress,
             abi: meltingPotesContract.abi,
             functionName: 'getBalanceOfInstance',
         })
           // Convertir la valeur de Wei en Ether
    const balanceInEther = formatEther(data);
    return balanceInEther
     }
     catch(err) {
         console.log(err.message)
     }

 }

   // Get the minimum deposit of the instance
   const getTotalBalanceInstance = async() => {
    try {
        const data = await readContract({
            address: instanceAddress,
            abi: meltingPotesContract.abi,
            functionName: 'getTotalBalanceOfInstance',
        })
      // Convertir la valeur de Wei en Ether
    const totalBalanceInEther = formatEther(data);
    return totalBalanceInEther
    }   
    catch(err) {
        console.log(err.message)
    }

}

  // Get the title of instance
  const getTitleInstance = async() => {
    try {
        const data = await readContract({
            address: instanceAddress,
            abi: meltingPotesContract.abi,
            functionName: 'title',
        })
        return data
    }   
    catch(err) {
        console.log(err.message)
    }
}

  // Get the minimum deposit of the instance
  const getMinimumDepositInstance = async() => {
    try {
        const data = await readContract({
            address: instanceAddress,
            abi: meltingPotesContract.abi,
            functionName: 'minimumDeposit',
        })

            // Convertir la valeur de Wei en Ether
    const minimumDepositInEther = formatEther(data);
        return minimumDepositInEther
    }   
    catch(err) {
        console.log(err.message)
    }
}

  // Get the date of expire of the instance
  const getDateOfExpireInstance = async() => {
    try {
        const data = await readContract({
            address: instanceAddress,
            abi: meltingPotesContract.abi,
            functionName: 'dateOfExpire',
        })
        return data
    }   
    catch(err) {
        console.log(err.message)
    }
}

  // Get instance status
  const getStatusInstance = async() => {
    try {
        const data = await readContract({
            address: instanceAddress,
            abi: meltingPotesContract.abi,
            functionName: 'instanceOff',
        })
        return data
    }   
    catch(err) {
        console.log(err.message)
    }
}


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
<Card border='1px' mt='3rem' mb='3rem' ml='13rem' mr='15rem'>
  <CardHeader>
    <Heading size='xl'>{title}</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Address 
        </Heading>
        <Text pt='2' fontSize='sm' whiteSpace='pre-line'>
          {instanceAddress} 
        </Text>
        <Text pt='2' fontSize='sm' whiteSpace='pre-line'>
          (share it only with other participants)
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Balance
        </Heading>
        <Text pt='2' fontSize='sm'>
        {balance === 0 ? '0' : `${balance}`}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          total sended
        </Heading>
        <Text pt='2' fontSize='sm'>
          {totalBalance === 0 ? '0' : `${totalBalance}`}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Minimum Deposit
        </Heading>
        <Text pt='2' fontSize='sm'>
          {minimumDeposit} Eth
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Date of expire
        </Heading>
        <Text pt='2' fontSize='sm'>
          {formatDate(dateOfExpire)}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Instance status
        </Heading>
        <Text pt='2' fontSize='sm' color={status ? 'red' : 'green'}>
                {status ? 'Off' : 'On'}
        </Text>
      </Box>
    </Stack>
  </CardBody>
</Card>
    </div>
  )
}

export default InstanceSetup