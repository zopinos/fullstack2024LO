import Button from "./Button"

const Person = ({ person, handleRemoval }) => {
    return (
        <li className="person">{person.name} {person.number} <Button text={"delete"} handleClick={() => handleRemoval(person.name, person.id)} /></li>
    )
}

const Persons = ({ persons, nameFilter, handleRemoval }) => {
    return (
        <div>
            <ul>
                {persons
                    .filter(person =>
                        (person.name.toLowerCase().includes(nameFilter.toLowerCase()))
                    )
                    .map(person => (
                        <Person key={person.id} person={person} handleRemoval={handleRemoval} />)
                    )
                }
            </ul>
        </div>
    )
}

export default Persons