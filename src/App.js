import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(' ')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })

      .catch(() => {
        setErrorMessage(
          `Error! Note '${note.content}' was already removed from server.`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 6000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = event => {
    event.preventDefault() //prevents the default action of submitting a form, to not to reload page.
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note=> note.important)

  return (
    <div className="wrapper">
      <div>
        <h1 className="title">Notes</h1>
        <Notification message={errorMessage}/>
        <div>
          <button className="show-button" onClick={() => setShowAll(!showAll)}>
            Show {showAll ? 'Important' : 'All' } Notes
          </button>
        </div>
        <ul>
          {notesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          )}
        </ul>
        <form className="form" onSubmit={addNote} >
          <input className="input"
            value={newNote} 
            onChange={handleNoteChange}  
            placeholder="Add a new note..."
          />
          <button type='submit' >save</button>
        </form>
        <Footer info={'Ana Chkhaidze'}/>
      </div>  
    </div>
  )
}

export default App