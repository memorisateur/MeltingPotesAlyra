'use client';
import { useState, createContext, useContext } from 'react';


const ThemeContext = createContext({});

export const EtherSpendedEventProvider = ({children}) => {

    
    const [etherSpendedEvent, setEtherSpendedEvent] = useState([]);


  return (
    <ThemeContext.Provider value={{etherSpendedEvent, setEtherSpendedEvent}}>
     {children}
     </ThemeContext.Provider>
  );
};

//créer le hook
export const useEtherSpendedEvent = () => {
    return useContext(ThemeContext);
  };