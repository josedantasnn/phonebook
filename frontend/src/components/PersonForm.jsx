const PersonForm = ({ nameValue, nameOnChange, numberValue, numberOnChange, onSubmit }) => {
    return (
        <form>
            <div>
                name: <input value={nameValue} onChange={nameOnChange}/>
            </div>
            <div>
                number: <input value={numberValue} onChange={numberOnChange}/>
            </div>
            <div>
                <button type="submit" onClick={onSubmit}>add</button>
            </div>
        </form>
    )
}

export { PersonForm }