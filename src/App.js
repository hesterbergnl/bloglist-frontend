import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import MultiFieldForm from './components/MultiFieldForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorFlag, setErrorFlag] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogsVisible, setBlogsVisible] = useState(false)

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

  const loginUser = async (userInfo) => {
    console.log(`User ${userInfo.username} login with pw ${userInfo.password}`)

    const username = userInfo.username
    const password = userInfo.password

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedInBlogUser', JSON.stringify(user)
      )
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

  const blogRender = () => (
    <>
      <h2>blogs</h2>
        <p>
          { user.name } logged in
          <button onClick={logoutUser}>logout</button>
        </p>

        <MultiFieldForm handleNewBlog={handleNewBlog} />

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </>
  )

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            loginUser={loginUser}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleNewBlog = async (newBlog) => {
    console.log('new blog created')

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

      <Togglable buttonLabel='login'>
        <LoginForm
            loginUser={loginUser}
          />
      </Togglable>

      <Togglable buttonLabel='new blog'>
        <MultiFieldForm handleNewBlog={handleNewBlog} />
      </Togglable>
      {user === null ? loginForm() : blogRender()}

    </div>
  )
}

export default App
