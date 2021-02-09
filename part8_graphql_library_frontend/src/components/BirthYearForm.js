import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {ALL_AUTHORS, UPDATE_AUTHOR} from "../qureies.js";

const BirthYearForm = (props) => {
    const [name, setName] = useState(props.authors && props.authors[0] && props.authors[0].name)
    const [born, setBorn] = useState('')


    const [updateYear] = useMutation(
        UPDATE_AUTHOR,
        {
            refetchQueries: [{query: ALL_AUTHORS}],
            onError: error => {
                console.log(error)
            }
        })


    const handleChange = (e) => {

        setName(e.target.value)
    }

    const submit = async (e) => {
        e.preventDefault()

        await updateYear({variables: {name, setBornTo: parseInt(born)}})
        setBorn('')
    }

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <label>name
                    <select defaultValue={props.authors[0] && props.authors[0].name} onChange={handleChange}>
                        {props.authors.map(a =>
                            <option key={a.name} value={a.name}>{a.name.toUpperCase()}</option>)}
                    </select>
                </label>
                <div>
                    born <input
                    value={born}
                    onChange={(e) => setBorn(e.target.value)}
                />
                </div>
                <button type="submit">update author</button>
            </form>

        </div>
    )
}

export default BirthYearForm