import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import MultiFieldForm from './components/MultiFieldForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorFlag, setErrorFlag] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInBlogUserJSON = window.localStorage.getItem('loggedInBlogUser')
    if (loggedInBlogUserJSON) {
      const user = JSON.parse(loggedInBlogUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginUser = async (event) => {
    event.preventDefault()
    console.log(`User ${username} login with pw ${password}`)

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedInBlogUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorFlag(true)
      setMessage(
        `Wrong username or password`
      )
      setTimeout(() => {
          setMessage(null)
      }, 5000)
    }
  }

  const logoutUser = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInBlogUser')
    setUser(null)
  }

  const blogFormData = [
    {
      label: 'title',
      value: title,
      onChange: ({ target }) => setTitle(target.value)
    },
    {
      label: 'author',
      value: author,
      onChange: ({ target }) => setAuthor(target.value)
    },
    {
      label: 'url',
      value: url,
      onChange: ({ target }) => setUrl(target.value)
    }
  ]

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={loginUser}>
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
    </>
  )

  const blogRender = () => (
    <>
      <h2>blogs</h2>
        <p>
          { user.name } logged in
          <button onClick={logoutUser}>logout</button>
        </p>

        <MultiFieldForm handleNewBlog={handleNewBlog} blogFormData={blogFormData}/>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </>
  )

  const handleNewBlog = async (event) => {
    event.preventDefault()
    console.log('new blog created')

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    try {
      const addedBlog = await blogService.create(newBlog)

      setBlogs( blogs.concat(addedBlog) )

      setErrorFlag(false)
      setMessage(
        `A new blog ${addedBlog.title} by ${addedBlog.author} added!`
      )
      setTimeout(() => {
          setMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch(error) {
      console.log(error)
      setErrorFlag(true)
      setMessage(
        `${error.response.data.toString()}`
      )
      setTimeout(() => {
          setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>

      <Notification message={message} errorFlag={errorFlag}/>

      {user === null ? loginForm() : blogRender()}

    </div>
  )
}

export default App
