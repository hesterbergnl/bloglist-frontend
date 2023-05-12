const Notification = ({message, errorFlag}) => {
  if (message === null) {
    return null
  }

  if (errorFlag === true) {
    return (
    <div className='error'>
      {message}
    </div>
    )
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

export default Notification
