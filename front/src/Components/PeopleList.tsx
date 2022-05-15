import React, { FC, useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import Persona from './Persona'
import styled from '@emotion/styled';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



//misma query que en apolloserver
const GET_PEOPLE = gql`
  query getPeople {
    getPeople{
      _id
      name 
      surname
    }
  }
`
type Person = {
  _id: string,
  name: string,
  surname: string
}

const ADD_PERSON = gql`
  mutation addPerson($name: String!, $surname: String!) {
  addPerson(name: $name, surname: $surname) {
    _id
    name
  }
}
`

type props = {
  texto: string
}

export const PeopleList: FC<props> = ({ texto }) => {

  const [persona, setPersona] = useState<string>("")
  useEffect(() => {
    if (texto) {
      setPersona(texto.replace("-", " "))
    }
  }, [texto])



  const { data, loading, error, refetch: rQuery } = useQuery<{ getPeople: Person[] }>(GET_PEOPLE)
  //getPeople devuelve un array de tipo personas, el nombre viene del nombre de la query (query getPeople)
  //if (loading) { return (<div>Cargando..</div>) }
  //  if (error) { return (<div>Error</div>)}
  const [addP] = useMutation(ADD_PERSON)

  useEffect(() => {
    if (persona) {
      console.log("mutation use effect")
      console.log("surname", persona.substring(persona.indexOf(" "), persona.length - 1))
      addP({
        variables: {
          name: persona.substring(0, persona.indexOf(" ")),
          surname: persona.substring(persona.indexOf(" ") + 1, persona.length)
        }
      })
      sleep(1100)//hay que dormir que el gql va lentito y no le da tiempo de hacer las querys
      rQuery() //refecth query after mutation

    }
  }, [persona])

  return (
    <div className= 'listaPer'>
      <MiBoton onClick={() => rQuery()}>Actualizar lista</MiBoton>
      <div className='listaPersonas'>
        {data && data.getPeople.map(elem => (<Persona
          key={elem.name + elem.surname}
          name={elem.name}
          surname={elem.surname}
          refetchData={rQuery} //pasamos la func para coger los datos de nuevo con la misma query en otro componente
        ></Persona>)
        )}
      </div>
    </div>

  )
}

const MiBoton = styled.button`
    
    background-color: papayawhip ;
    color:  black;
    width: auto;
    height: 31px;
    align-self:center;
    border-radius: 5px;
    opacity:0.9;
    
    &:hover {
        transition: 1s ease;
        -webkit-transform: scale(0.8);
        -ms-transform: scale(0.8);
        transform: scale(0.8);
        opacity:1;
        cursor:pointer
    }
`
