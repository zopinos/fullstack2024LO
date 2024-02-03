const Filter = ({ filter, handleChange }) => {
    return (<div>find countries <input value={filter} onChange={handleChange} /></div>)
}

export default Filter