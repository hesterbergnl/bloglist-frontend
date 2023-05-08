const buildInput = ( element ) => (
  <div key={element.label}>
    {element.label}:
    <input type='text' value={element.value} onChange={element.onChange}/>
  </div>
)

const MultiFieldForm = (props) => (
  <form onSubmit={props.handleNewBlog}>
    {props.blogFormData.map(buildInput)}
    <button type="submit">create</button>
  </form>
)

export default MultiFieldForm
