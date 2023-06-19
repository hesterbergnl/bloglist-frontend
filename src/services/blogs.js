import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  console.log(newBlog.id)

  const url = `${baseUrl}/${newBlog.id}`

  await axios.put(url, newBlog, config)
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  console.log(blog.id)

  const url = `${baseUrl}/${blog.id}`

  await axios.delete(url, config)

}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, create, update, remove }
