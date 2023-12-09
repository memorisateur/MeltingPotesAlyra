'use client';
import { useState, createContext, useContext } from 'react';


const ThemeContext = createContext({});

export const InstanceAddressProvider = ({children}) => {

    
    const [instanceAddress, setInstanceAddress] = useState('');


  return (
    <ThemeContext.Provider value={{instanceAddress, setInstanceAddress}}>
     {children}
     </ThemeContext.Provider>
  );
};

//créer le hook
export const useInstanceAddress = () => {
    return useContext(ThemeContext);
  };