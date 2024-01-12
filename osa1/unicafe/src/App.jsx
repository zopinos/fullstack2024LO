import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  console.log(props)

  const { text, value } = props

  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Statistics = (props) => {
  console.log(props)

  const { good, neutral, bad } = props

  const countAll = () => (good + neutral + bad)

  const countAverage = () => {
    if (countAll() == 0) { return 0 }

    return (good - bad) / countAll()
  }

  const countPositive = () => {
    if (countAll() == 0) { return 0 }

    return 100 * good / countAll()
  }

  if (countAll() > 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text={"good"} value={good} />
            <StatisticLine text={"neutral"} value={neutral} />
            <StatisticLine text={"bad"} value={bad} />
            <StatisticLine text={"all"} value={countAll()} />
            <StatisticLine text={"average"} value={countAverage()} />
            <StatisticLine text={"positive"} value={countPositive() + " %"} />
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div>
        No feedback given
      </div>
    )
  }

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => { setGood(good + 1) }} text={"good"} />
      <Button handleClick={() => { setNeutral(neutral + 1) }} text={"neutral"} />
      <Button handleClick={() => { setBad(bad + 1) }} text={"bad"} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App