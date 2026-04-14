const Persons = ({ persons, deleteThisPerson }) => {
    return (
        persons.map(p =>
            <p key={p.id}>
                {p.name} {p.number}
                <button onClick={() => {
                    if(confirm(`Delete ${p.name}?`)) {
                        deleteThisPerson(p.id)
                    }
                }}>
                    delete
                </button>
            </p>
        )
    )
}

export { Persons }