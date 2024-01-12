import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const [selected, setSelected] = useState(0)

  const randomPos = (until) => Math.floor(Math.random() * until)

  const voteAnecdote = (idx) => {
    const pointsCopy = [...points]
    pointsCopy[idx] += 1
    setPoints(pointsCopy)
  }

  const findBestIdx = () => points.indexOf(Math.max(...points))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button text="vote" handleClick={() => { voteAnecdote(selected) }} />
      <Button text="next anecdote" handleClick={() => { setSelected(randomPos(anecdotes.length)) }} />

      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[findBestIdx()]}</p>
      <p>has {points[findBestIdx()]} votes</p>
    </div>
  )
}

export default App