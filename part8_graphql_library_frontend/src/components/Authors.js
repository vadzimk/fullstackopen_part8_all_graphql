import React from 'react'
import {useQuery} from "@apollo/client";
import {ALL_AUTHORS} from "../qureies.js";
import BirthYearForm from "./BirthYearForm.js";

const Authors = (props) => {

    const result = useQuery(ALL_AUTHORS)


    if (result.loading || !result.data) {

        return null
    }

    if (!props.show) {
        return null
    }
    const authors = result.data.allAuthors // modifies the reactive variable in apollo


    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>
                        born
                    </th>
                    <th>
                        books
                    </th>
                </tr>
                {authors.map(a =>
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                )}
                </tbody>
            </table>
            {
                props.token &&
                <BirthYearForm authors={authors}/>
            }

        </div>
    )
}

export default Authors
