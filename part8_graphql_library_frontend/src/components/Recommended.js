import React, {useEffect, useState} from 'react'
import BookTable from "./BookTable.js";
import {useQuery} from "@apollo/client";
import {ALL_BOOKS} from "../qureies.js";

const Recommended = ({show, dataUser}) => {
    const [books, setBooks] = useState([])


    const {data: dataBooks} = useQuery(ALL_BOOKS, {
        skip: !dataUser,  // skip option to while when the previous query fulfills
        variables: {genre: dataUser && dataUser.me && dataUser.me.favoriteGenre}
    })

    useEffect(() => {

        if (dataBooks && dataUser && dataUser.me) {
            setBooks(
                dataBooks.allBooks.filter(b => b.genres.includes(dataUser.me.favoriteGenre))
            )

        }

    }, [dataBooks, dataUser])


    if (!show || !dataBooks || !dataUser || !dataUser.me) {
        return null
    }


    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{dataUser.me.favoriteGenre}</strong></p>
            <BookTable books={books}/>
        </div>
    )
}

export default Recommended

