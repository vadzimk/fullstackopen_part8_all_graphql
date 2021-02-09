import React, {useEffect, useState} from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from "./components/LoginForm.js";
import {useApolloClient, useQuery, useSubscription} from "@apollo/client";
import Recommended from "./components/Recommended.js";
import {ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, FETCH_USER} from "./qureies.js";

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)

    const {data: dataUser} = useQuery(FETCH_USER, {
        skip: !token
    })

    const client = useApolloClient() // allows to clear the cache with clearStore or resetStore - will re-fetch

    const updateCacheWith = (addedBook) => {
        const includedIn = (set, obj) => set.map(b => b.id).includes(obj.id)
        const booksInStore = client.readQuery({query: ALL_BOOKS}) || []

        if (!includedIn(booksInStore.allBooks || [], addedBook)) {
            client.writeQuery(
                {
                    query: ALL_BOOKS,
                    data: {allBooks: booksInStore.allBooks.concat(addedBook)}
                }
            )
        }

        const authorsInStore = client.readQuery({query: ALL_AUTHORS})
        if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
            client.writeQuery(
                {
                    query: ALL_AUTHORS,
                    data: {allAuthors: authorsInStore.allAuthors.concat(addedBook.author)}
                }
            )
        }
    }


    useEffect(() => {
        setToken(localStorage.getItem("library-user-token"))
    }, [page, token])

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({subscriptionData}) => {
            console.log("subscriptionData", subscriptionData.data.bookAdded.title)
            updateCacheWith(subscriptionData.data.bookAdded)
        }
    })

    const logout = () => {

        client.clearStore()
        localStorage.clear()
        setToken(null)
        console.log('logged out, token', token)
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {
                    token
                        ? <>
                            <button onClick={() => setPage('add')}>add book</button>
                            <button onClick={() => setPage('recommended')}>recommended</button>
                            <button onClick={logout}>logout</button>
                        </>
                        : <button onClick={() => setPage('login')}>login</button>
                }

            </div>
            <LoginForm
                show={page === 'login'}
                setToken={setToken}
            />
            <Authors
                show={page === 'authors'}
                token={token}
            />
            <Books
                show={page === 'books'}
            />
            <NewBook
                show={page === 'add'}
                dataUser={dataUser}
                updateCacheWith={updateCacheWith}
            />
            <Recommended
                dataUser={dataUser}
                show={page === 'recommended'}
            />

        </div>
    )
}

export default App