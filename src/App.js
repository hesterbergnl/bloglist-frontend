import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import MultiFieldForm from './components/MultiFieldForm'
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
      console.log('Wrong credentials')
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

    const addedBlog = await blogService.create(newBlog)

    setBlogs( blogs.concat(addedBlog) )

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>

      {user === null ? loginForm() : blogRender()}

    </div>
  )
}

export default App
