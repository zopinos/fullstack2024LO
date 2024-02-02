import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        updateNumber()
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (name, id) => {
    if (!confirm(`Delete ${name}?`)) return

    personService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const updateNumber = () => {
    const person = persons.find(p => p.name === newName)

    const changedPerson = { ...person, number: newNumber }

    personService
      .update(person.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.name !== newName ? p : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    console.log(event.target.value)
    setNameFilter(event.target.value)
  }

  useEffect(() => {
    console.log("effect")
    personService
      .getAll()
      .then(initialPersons => {
        console.log("promise fulfilled")
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={nameFilter} handleChange={handleNameFilterChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} handleRemoval={removePerson} />
    </div>
  )

}

export default App