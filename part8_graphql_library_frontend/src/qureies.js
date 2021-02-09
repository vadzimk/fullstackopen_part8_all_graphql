import {gql} from '@apollo/client'

export const ALL_AUTHORS = gql`
    query getAllAuthors{
        allAuthors{
            name
            id
            born
            bookCount
        }
    }
`
const BOOK_DETAILS_FRAGMENT = gql`
    fragment BookDetails on Book{
        title
        author{
            name
            id
            born
            bookCount
        }
        published,
        genres,
        id
    }
`
export const ALL_BOOKS = gql`
    query getAllBooks($author: String, $genre: String){
        allBooks(author: $author, genre: $genre){
            ...BookDetails
        }
    }
    ${BOOK_DETAILS_FRAGMENT}
`


export const CREATE_BOOK = gql`
    mutation newBook($title: String!, $author: String!, $published: Int!, $genres: [String]!){
        addBook(title: $title, author: $author, published: $published, genres: $genres){
            title
            author{
                name
                id
            }
            published
            genres
            id
        }
    }
`

// subscription
export const BOOK_ADDED = gql`
    subscription {
        bookAdded{
            ...BookDetails
        }
    }
    ${BOOK_DETAILS_FRAGMENT}
`

export const UPDATE_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!){
        editAuthor(name: $name, setBornTo: $setBornTo){
            name
            born
            id
            bookCount
        }
    }

`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
        }
    }
`

export const FETCH_USER = gql`
    query me{
        me{
            username
            favoriteGenre
        }
    }
`