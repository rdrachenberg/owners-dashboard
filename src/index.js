import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import reportWebVitals from './reportWebVitals';

import { Web3ReactProvider } from "@web3-react/core";
import Web3 from 'web3'

const root = ReactDOM.createRoot(document.getElementById('root'));

function getLibrary(provider, connector) {
  // console.log(new Web3(provider))
  return new Web3(provider)
}
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Web3ReactProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
