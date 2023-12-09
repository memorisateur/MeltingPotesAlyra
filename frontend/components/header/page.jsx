'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text, Spacer, Box, Image } from "@chakra-ui/react";

import Link from "next/link";

//constants
import { useInstanceAddress } from '@/constants/instanceAddress';

const Header = () => {

  //createInstance arguments
  const {instanceAddress, setInstanceAddress} = useInstanceAddress();


  const goBack = async() => {
    await setInstanceAddress('');
    await console.log(instanceAddress);
}

  return (
<Flex
      bg="#e0e0e0"
      p="2rem"
      justifyContent="space-between"
      alignContent="center"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)" // Ajout d'une ombre légère
    >
      <Link href="/" onClick={goBack}>
      <Text as="a" fontSize="xl" color="#333" mr="1rem">
            Melting Potes
      </Text>
      </Link>
      <Box boxSize='sm' width='4%' height='20px' ml='1%' marginTop='-10px'>
  <Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_vote.svg/800px-Logo_vote.svg.png' alt='bulletin de vote' />
</Box>
    <Spacer />

      <Flex alignItems="center">
      <Link href="/" passHref onClick={goBack}>
          <Text as="a" fontSize="xl" color="#333" mr="1rem">
            Interface
          </Text>
        </Link>

        <Link target="_blank" href="https://xmtp.chat/inbox" passHref>
        <Text as="span" fontSize="xl" color="#333" mr="1rem">
          Messagerie
        </Text>
    </Link>
      </Flex>
      <ConnectButton />
    </Flex>
  )
}

export default Header