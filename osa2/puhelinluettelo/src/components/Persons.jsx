const Person = ({ name, number }) => {
    return (
        <li>{name} {number}</li>
    )
}

const Persons = ({ persons, nameFilter }) => {
    return (
        <div>
            <ul>
                {persons
                    .filter(person =>
                        (person.name.toLowerCase().includes(nameFilter.toLowerCase()))
                    )
                    .map(person => (
                        <Person key={person.name} name={person.name} number={person.number} />)
                    )
                }
            </ul>
        </div>
    )
}

export default Persons