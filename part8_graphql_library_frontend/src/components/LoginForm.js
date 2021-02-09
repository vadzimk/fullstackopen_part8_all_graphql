import React, {useEffect, useState} from 'react'
import {useMutation} from "@apollo/client";
import {LOGIN} from "../qureies.js";


const LoginForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // run mutation on submit, update local storage when result comes back
    const [login, result] = useMutation(LOGIN, {onError: e=>console.log(e)})

    useEffect(()=>{
        if(result.data){
            const token  = result.data.login.value
            props.setToken(token)
            localStorage.setItem("library-user-token", token)
        }
    }, [result.data, props])

    const submit =(e)=>{
        e.preventDefault()
        login({variables: {username, password}})
        setUsername('')
        setPassword('')

    }

    if (!props.show) {
        return null
    }

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={submit}>
                <div>
                    username <input
                    onChange={({target}) => {
                        setUsername(target.value)
                    }}
                />
                </div>
                <div>
                    password <input
                    onChange={({target}) => {
                        setPassword(target.value)
                    }}
                />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm