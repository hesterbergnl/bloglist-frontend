import { useState } from 'react'

const Blog = ({blog, action, user, deleteAction}) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = {display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = (event) => {
    event.preventDefault()

    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id
    }

    action(newBlog)
  }

  const handleDelete = (event) => {
    event.preventDefault()

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteAction(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{ visible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        <div>
          {user.username === blog.user.username ? <button onClick={handleDelete}>Delete</button> : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
