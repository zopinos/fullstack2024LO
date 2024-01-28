const Header = ({ name }) => <h1>{name}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) =>
    <>
        {parts.map(p => <Part key={p.id} part={p} />)}
    </>

const Course = ({ course }) => {
    console.log("Course: ", course)

    const numOfEx = course.parts.reduce(((acc, cur) => acc + cur.exercises), 0)

    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total sum={numOfEx} />
        </>
    )
}

export default Course