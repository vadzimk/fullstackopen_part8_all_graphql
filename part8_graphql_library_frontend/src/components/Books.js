import React, {useEffect, useState} from 'react'
import {useQuery} from "@apollo/client";
import {ALL_BOOKS} from "../qureies.js";
import GenreForm from "./GenreForm.js";
import BookTable from "./BookTable.js";


const Books = (props) => {


    const [books, setBooks] = useState([])
    const [genres, setGenres] = useState([])
    const result = useQuery(ALL_BOOKS)


    useEffect(() => {
        if (result.data) {
            setBooks(result.data.allBooks)

            const allGenres = result.data.allBooks.reduce((acc, currVal) => {

                return acc.concat(currVal.genres)
            }, [])
            setGenres(allGenres)
        }

    }, [result.data])

    const handleChange = (e) => {
        console.log("value", e.target.value)
        if (e.target.value === 'all') {
            setBooks(result.data.allBooks)
        }else{
            setBooks(
                result.data.allBooks.filter(b => b.genres.includes(e.target.value))
            )
        }
    }


    if (!props.show || result.loading) {
        return null
    }



    return (
        <div>
            <h2>books</h2>
            <GenreForm
                genres={genres}
                onChange={handleChange}
            />
            <BookTable books={books}/>
        </div>
    )
}

export default Books