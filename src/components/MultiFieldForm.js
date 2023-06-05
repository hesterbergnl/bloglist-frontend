import { useState } from 'react'

const buildInput = ( element ) => (
  <div key={element.label}>
    {element.label}:
    <input type='text' value={element.value} onChange={element.onChange}/>
  </div>
)

const MultiFieldForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submitBlog = (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    props.handleNewBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
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

  return (
    <form onSubmit={submitBlog}>
      {blogFormData.map(buildInput)}
      <button type="submit">create</button>
    </form>
  )
}

export default MultiFieldForm
