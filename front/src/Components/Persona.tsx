import React, { FC, useState } from 'react'
import styled from '@emotion/styled';
import _ from 'lodash';
import { gql, useMutation } from '@apollo/client';



type PersonajeTypePROPS = {
    name: string;
    surname: string;
    refetchData: () => void;
}

const DELETE_PERSON = gql`
    mutation deletePerson($name: String!, $surname: String!) {
        deletePerson(name: $name, surname: $surname)
    }
`
const MODIFY_PERSON = gql`
    mutation modifyPerson($name: String!, $surname: String!, $newName: String!, $newSurname: String!) {
        modifyPerson(name: $name, surname: $surname, newName: $newName, newSurname: $newSurname)
}

`


const Persona: FC<PersonajeTypePROPS> = ({ name, surname, refetchData }) => {//LUUK
    const [estadoBoton, setEstadoBoton] = useState<boolean>(false)
    const [estadoEdicion, setEstadoEdicion] = useState<boolean>(false)

    const [texto, setTexto] = useState<string>("") //nombre
    const [texto2, setTexto2] = useState<string>("")//apellido

    const setEstadoDisntinto = () => {
        setEstadoBoton(!estadoBoton)
    }
    const debounces = _.debounce(setEstadoDisntinto, 500);  //espera x segundos para ejecutar la funcion

    const [deleteP] = useMutation(DELETE_PERSON)
    const [modifyP] = useMutation(MODIFY_PERSON)
    return (

        <DivStyled onMouseEnter={() => { debounces() }} onMouseLeave={() => { setEstadoDisntinto() }} >
            <DivPersonajeStyled key={name}>
                {name}
                <div></div>
                {surname}
            </DivPersonajeStyled>
            <MiBoton visibilidad={estadoBoton} margin={"5px"} inputColor={'red'} onClick={async () => {
                deleteP({ variables: { name: name, surname: surname } })
                await new Promise(r => setTimeout(r, 1100));//hay que dormir que el gql va lentito y no le da tiempo de hacer las querys
                refetchData() //funciona regular
                //crear la misma query igual?
            }} >Borrar</MiBoton>


            <MiBoton visibilidad={estadoBoton} margin={'5px'} inputColor={'lightgreen'} onClick={() => {
                setEstadoEdicion(!estadoEdicion) //se cierra si está abierto (con un click)
            }}>Editar</MiBoton>

            <MiInput visibilidad={estadoEdicion} margin={'20px'} placeholder='Nuevo nombre' value={texto} type="text" onChange={(e) => setTexto(e.target.value)}></MiInput>
            <MiInput visibilidad={estadoEdicion} margin={'20px'} placeholder='Nuevo apellido' value={texto2} type="text" onChange={(e) => setTexto2(e.target.value)}></MiInput>
            <MiBoton visibilidad={estadoEdicion} margin={'5px'} inputColor={'lightgreen'} onClick={async () => {
                modifyP({ variables:{
                    name:name, surname:surname,
                    newName: texto, newSurname: texto2
                }})
                await new Promise(r => setTimeout(r, 1100));//hay que dormir que el gql va lentito y no le da tiempo de hacer las querys
                refetchData() //funciona regular
            }} >Guardar</MiBoton>


        </DivStyled>
    )
}




const DivStyled = styled.div`
  width: 1200px;
  flex: 1 0 auto;
`

//le entrara
const DivPersonajeStyled = styled.div`
    text-align: center;
    margin: 10px;
    border-radius: 0.5rem;
    border: 3px black;
    background-color: papayawhip;
    flex: 1 0 auto;
    margin-left: 40px;
`


export default Persona;





type StyledBoton = {
    visibilidad: boolean;
    margin: string;
    inputColor: string;
}
const MiBoton = styled.button<StyledBoton>`
        
    margin:${(props: any) => (props.margin)};
    visibility:${(props: any) => (props.visibilidad ? "visible" : "hidden")};;
    background-color: papayawhip ;
    color:  black;
    width: auto;
    height: 40px;
    align-self:center;
    border-radius: 5px;
    opacity:0.9;
    
    &:hover {
        transition: 1s ease;
        -webkit-transform: scale(0.8);
        -ms-transform: scale(0.8);
        transform: scale(0.8);
        opacity:1;
        background-color:${(props: any) => (props.color)};
        cursor:pointer
    }
`


type StyledInput = {
    visibilidad: boolean;
    margin: string;
}
const MiInput = styled.input<StyledInput>`
  padding: 0.5em;
  /* height: 20px; */
  align-items: center;
  margin: ${(props: any) => (props.margin)};
  visibility:${(props: any) => (props.visibilidad ? "visible" : "hidden")};;
  color: black;
  background-color: papayawhip;
  border: none;
  border-radius: 3px;
`;