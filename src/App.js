import { useState, useEffect, useRef } from 'react'
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
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [blogs])

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

        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <MultiFieldForm handleNewBlog={handleNewBlog} />
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} action={increaseLikes}/>
        )}
    </>
  )

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
              loginUser={loginUser}
            />
        </Togglable>
      </div>
    )
  }

  const handleNewBlog = async (newBlog) => {
    console.log('new blog created')

    blogFormRef.current.toggleVisibility()

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

  const increaseLikes = async (blog) => {
    console.log('increasing blog likes!')

    try {
      console.log(blog)

      const updatedBlog = await blogService.update(blog)

      const newBlogs = blogs.map(b => b.id === blog.id ? {...b, likes: b.likes + 1} : b);

      setBlogs( newBlogs )
    } catch(error) {
      console.log(error)
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
