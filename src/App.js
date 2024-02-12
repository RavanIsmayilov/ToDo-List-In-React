import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { validate } from "./helpers";
import "./App.css";

function App() {
  const [list, setList] = useState([]);

  const [todo, setTodo] = useState({
    text: "",
    completed: false,
    duration: 5, 
  });

  const [errors, setErrors] = useState({
    text: "",
  });

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setTodo({
      ...todo,
      [name]: value,
    });

    const error = validate(name, value);

    setErrors({
      [name]: error,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.text.length > 0 || todo.text.trim() === "") {
      alert("Something went wrong");
    } else {
      const newTodo = {
        ...todo,
        id: uniqid(),
      };

      setList([...list, newTodo]);

      setTodo({
        text: "",
        completed: false,
        duration: 5, 
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setList((prevList) =>
        prevList.map((item) =>
          item.duration > 0
            ? { ...item, duration: item.duration - 1 }
            : { ...item, duration: 0 }
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const expiredItems = list.filter((item) => item.duration === 0);
    
    if (expiredItems.length > 0) {
      setList((prevList) =>
        prevList.filter((item) => item.duration > 0)
      );
    }
  }, [list]);

  function toggle(id) {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  }

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form_into">
          <div className="input">
            <label style={{ fontWeight: "500" }} htmlFor="todo">
              Todo
            </label>
            <input
              className="todo"
              name="text"
              value={todo.text}
              onChange={handleChange}
            />
            {errors.text && <p style={{ color: "red" }}>{errors.text}</p>}
            <button className="btn" type="submit">
              Submit
            </button>
          </div>

          <div className="elements">
            {list.map((item) => (
              <div key={item.id}>
                <input type="checkbox" onClick={() => toggle(item.id)} />
                <label
                  htmlFor="checkbox"
                  style={{
                    textDecoration: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.7 : 1,
                  }}
                >
                  {" "}
                  {item.text} - Time Left: {item.duration} seconds
                </label>{" "}
                <br />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
