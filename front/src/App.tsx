import React from 'react';
import './App.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PeopleList } from './Components/PeopleList';
import { AddPerson } from './Components/AddPerson';
import { Contenedor } from './Components/Contenedor';

function App() {

  const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache()
  })
  console.log(`api url ${process.env.REACT_APP_API_URL}`)
  return (

   
    <ApolloProvider client={client}>
        <Contenedor/>
    </ApolloProvider>
  );
}

export default App;
