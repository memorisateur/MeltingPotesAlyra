'use client';
import { useState, createContext, useContext } from 'react';


const ThemeContext = createContext({});

export const InstanceAddedEventProvider = ({children}) => {

    
    const [instanceAddedEvent, setInstanceAddedEvent] = useState([]);


  return (
    <ThemeContext.Provider value={{instanceAddedEvent, setInstanceAddedEvent}}>
     {children}
     </ThemeContext.Provider>
  );
};

//créer le hook
export const useInstanceAddedEvent = () => {
    return useContext(ThemeContext);
  };