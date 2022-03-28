import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {GET_ALL_USERS} from "./query/user";
import {CREATE_USER} from "./mutations/user";
import logo from './logo.svg';
import './App.css';


function App() {
    const {data, loading, refetch} = useQuery(GET_ALL_USERS)
    const [newUser] = useMutation(CREATE_USER)

    const [users, setUsers] = useState([])
    const [formData, setFormData] = useState({username: '', age: ''})

    const handleInput = (e) => {
        const {value, name} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await newUser({
                variables: {input: formData}
            })
            await refetch()
            setFormData({username: '', age: ''})
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!loading) {
            setUsers(data.getAllUsers)
        }
    }, [data])

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <form onSubmit={handleSubmit} className="App-form">
                    <input
                        value={formData.username}
                        name="username"
                        placeholder="username"
                        type="text"
                        required
                        onChange={handleInput}/>
                    <input
                        value={formData.age}
                        name="age"
                        placeholder="age"
                        type="number"
                        required
                        onChange={handleInput}/>
                    <button type="submit">Create</button>
                </form>
                {
                    loading ? <p>Loading...</p> :
                        <ul>{users?.map(user => <li key={user.id}>{user.username} {user.age}</li>)}</ul>
                }
            </header>
        </div>
    );
}

export default App;
