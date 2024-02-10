import './App.css';
import {useState} from "react"
import uniqid from "uniqid";
import { validate } from './helpers';

function App() {

  const [list,setList] = useState([])

  const [todo,setTodo] = useState({
    text: "",
    completed:false
  })


  const [errors,setErrors] = useState({
    text: "",
  })

  const handleChange = (e) => {
    e.preventDefault()

    const {name,value} = e.target

    setTodo({
      ...todo,
      [name]: value
    })

    const error = validate(name,value)

    setErrors({
      [name]:error
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault()

    if(errors.text.length > 0){
      alert("SOmething went wrong")
    } else{

      setList([  ...list,
        
        {
          ...todo,
          id:uniqid()
        }   
      ])

      setTodo({
        text:"",
        completed:false
      })
    }
  }

  function toggle(id){
    const element = list.find(item => item.id === id)
    element.completed ? element.completed = false : element.completed = true
    setList([...list])

  }

  return (
  <form className='form' onSubmit = {handleSubmit}>
    <div className='form_into'>
      <div className='input'> 
        <label style={{fontWeight:"500"}} htmlFor="todo">Todo</label>
        <input
          className='todo'
          name="text"
          value={todo.text}
          onChange={handleChange}
        />
        {errors.text && <p style={{ color: "red" }}>{errors.text}</p>}
          <button className='btn' type="submit">Submit</button>

      </div>

      <div className='elements'>
        {list.map((item) => (
          <div key={item.id}> 
          
          <input type="checkbox" onClick={() => toggle(item.id)}  />
          <label htmlFor="checkbox"  style={{textDecoration: item.completed ? "line-through" : 'none',opacity: item.completed ? .7 : 1}}> {item.text}</label> <br/>
        
        </div>
        ))}
      </div>
      </div>

  </form>
  );
}

export default App;