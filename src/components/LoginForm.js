import { useState } from 'react'

const LoginForm = ({
    loginUser
  }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const newUser = (event) => {
    event.preventDefault()

    const userInfo = {
      username: username,
      password: password
    }

    loginUser(userInfo)

    setUsername('')
    setPassword('')
  }

  return ( <div>
      <h2>log in to application</h2>
      <form onSubmit={newUser}>
        <div>
          username
            <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
