import styled from '@emotion/styled';
import React, { useState } from 'react'

type RellenoProps = {
  changeText: (text: string) => void;
};

export const AddPerson = ({changeText}) => {

  const [busqueda, setBusqueda] = useState <string>("")
  const [apellido,setApellido] = useState <string>("")
  
  return (
    <div>
      <MiInput value={busqueda} type="text" onChange={(e) => setBusqueda(e.target.value)} placeholder="nombre"></MiInput>
      <MiInput value={apellido} type="text" onChange={(e) => setApellido(e.target.value)} placeholder="apellido"></MiInput>
      <MiBoton onClick={() => { changeText(busqueda+ "-" + apellido) }}>Boton</MiBoton>
    </div>
  )
}


const MiInput = styled.input`
  padding: 0.5em;
  margin-right: 5px;
  margin-bottom: 5px;
  margin-top: 5px;

  /* height: 20px; */
  align-items: center;
  color: black;
  background-color: papayawhip;
  border: none;
  border-radius: 3px;
`;



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