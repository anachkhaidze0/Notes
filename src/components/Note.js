const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'Important' : 'Not Important'

  return (
   <div className="notes">
    <li className="note-content">{note.content}</li>
    <button className={note.important ? "important" : "not-important"  } onClick={toggleImportance}>{label}</button>
   </div>
  )
}

export default Note