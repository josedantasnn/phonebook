import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import Notification from './components/Notification'
import db from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [filterActive, setFilterActive] = useState(false)
  const [filteredResults, setFilteredResults] = useState([])
  const [successNotification, setSuccessNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)

  useEffect(() => {
    db.getAll().then(personsList => {
      console.log(personsList)
      return setPersons(personsList)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterQueryChange = (event) => {
    setFilterQuery(event.target.value)

    setFilterActive(event.target.value.length > 0 ? true : false)

    const newArr = persons.filter(person =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    )

    setFilteredResults(newArr)
  }

  const handleAddClick = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      const existingPerson = persons.find(p => p.name === newName)
      const updatedPerson = { ...existingPerson, number: newNumber }
      const replaceRecord = confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)
      if (replaceRecord) {
        db.updatePhoneNumber(existingPerson.id, updatedPerson).then(returnedPerson => {          
          setSuccessNotification(`Phone number updated for ${updatedPerson.name}`)
          setTimeout(() => setSuccessNotification(null), 3000)
          setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
        })
        .catch(error => {
          console.log('Error when trying to use PUT method to update phone number of existing contact:', error)
          setErrorNotification(`Information of ${updatedPerson.name} has already been removed from server`)
          setTimeout(() => setErrorNotification(null), 3000)
          setPersons(persons.filter(person => person.id !== updatedPerson.id))
        })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      db.create(newPerson).then(returnedPerson => {
        setSuccessNotification(`${newPerson.name} added to the phonebook`)
        setTimeout(() => setSuccessNotification(null), 3000)
        return setPersons(persons.concat(returnedPerson))
      })
    }

    setNewName('')
    setNewNumber('')

  }

  const handleDeleteClick = (id) => {
    const record = persons.find(p => p.id === id)
    db.deletePerson(id)
      .then(deletedEntry => console.log(deletedEntry))
      .catch(error => {
        console.log('Error when trying to delete a record:', error)
        setErrorNotification(`Information of ${record.name} has already been removed from server`)
        setTimeout(() => setErrorNotification(null), 5000)
      })
    setPersons(persons.filter(p => p.id !== id))
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successNotification} cssClass='success' />
      <Notification message={errorNotification} cssClass='error' />

      <Filter value={filterQuery} onChange={handleFilterQueryChange} />

      <h3>Add a new</h3>

      <PersonForm
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
        onSubmit={handleAddClick}
      />

      <h3>Numbers</h3>

      <Persons persons={filterActive ? filteredResults : persons} deleteThisPerson={handleDeleteClick} />
    </div>
  )
}

export default App