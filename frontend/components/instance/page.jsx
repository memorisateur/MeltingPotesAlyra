'use client'

import InstanceSetup from "./instanceSetup/page"
import AuthorizedAddress from "./admin/authorizedAddress/page"
import AddParticipant from "./admin/addParticipant/page"
import EndInstanceNow from "./admin/endInstanceBefore/page"
import EndInstanceAfter from "./participants/endInstanceAfter/page"
import DepositMoney from "./participants/depositMoney/page"
import SpendMoney from "./participants/spendMoney/page"
import HistoryTable from "./participants/historyTable/page"


import { 
  Flex,
} from '@chakra-ui/react'
//wagmi
import { usePublicClient } from "wagmi";
import { prepareWriteContract, readContract } from '@wagmi/core'

//react
import { useState, useEffect } from "react";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';
import { meltingPotesContract } from '@/constants/contract';

const Instance = () => {

  //public client wagmi
  const publicClient = usePublicClient();

  //instance's address
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();

  // Date of expire of the instance
  const [actualDateOfExpire, setActualDateOfExpire] = useState(0);
  const [currentDate, setCurrentDate] = useState(0);

  // Utilisez cette fonction pour obtenir la date actuelle en format Unix
  const getCurrentUnixTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};

  useEffect(() => {
    const updateInstance = async () => {

      setActualDateOfExpire(await getActualDateOfExpireInstance());
      setCurrentDate(await getCurrentUnixTimestamp());

    };

    updateInstance()
  }, [publicClient]);


    // Get the date of expire of the instance
    const getActualDateOfExpireInstance = async() => {
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


  return (
    <div>
    <AddParticipant />
    <InstanceSetup />
    <Flex  mt='-2rem' mb='3rem' ml='25rem' direction={{ base: 'column', md: 'row' }} alignItems="center">
        <DepositMoney />
        <SpendMoney />
      </Flex>
    <AuthorizedAddress />
    <HistoryTable />

    {currentDate > actualDateOfExpire ? (
      <EndInstanceAfter />
    ) : (
      <EndInstanceNow />
    )}
    </div>
  )
}

export default Instance