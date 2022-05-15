import React, { useState } from 'react'
import { AddPerson } from './AddPerson'
import { PeopleList } from './PeopleList'

export const Contenedor = () => {
    const [persona, setPersona] = useState<string | undefined>(undefined)

    return (
        <div className='Contenedor'>
            <AddPerson key={1} changeText={setPersona} />
            <PeopleList key={2} texto={persona} />
        </div>
    )
}
