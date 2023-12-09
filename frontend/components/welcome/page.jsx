'use client'
import {
    Image,
    Box,
  } from '@chakra-ui/react'
  import { ConnectButton } from "@rainbow-me/rainbowkit";
  import { useState } from 'react';
  import './styles.css';

//   <label boxSize='sm' width='4%' height='1px' ml='1%' marginTop='-10px'>
//   <Image src='https://c0.klipartz.com/pngpicture/281/883/gratis-png-ilustracion-de-olla-de-coccion-negra-iconos-de-computadora-cocinando-cocina.png' alt='bulletin de vote' />
// </label>

const Welcome = () => {
  return (
    <div htmlFor="boxy">
    <form htmlFor="welcome">
      <label htmlFor="logo">MELTING POTES</label>

      <label htmlFor="slogan">Quand les blockchains font les bons amis</label>
      <ConnectButton />
    </form>
    </div>
  )
}

export default Welcome