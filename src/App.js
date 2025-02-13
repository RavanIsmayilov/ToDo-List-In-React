import React, { useState, useEffect } from "react";
import { validate } from "./helpers";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  const [todo, setTodo] = useState({
    text: "",
    duration: 100,
    completed: false,
  });

  const [errors, setErrors] = useState({ text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });

    const error = validate(name, value);
    setErrors({ [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (todo.text.trim() === "") {
      setErrors({ text: "Todo text cannot be empty" });
      return;
    }

    if (isEditing) {
      setList((prevList) =>
        prevList.map((item) =>
          item.id === editId
            ? { ...item, text: todo.text, duration: todo.duration, completed: todo.completed }
            : item
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setList((prevList) => [...prevList, { ...todo, id: Date.now() }]);
    }

    setTodo({
      text: "",
      duration: 100,
      completed: false,
    });

    setErrors({ text: "" });
  };

  const handleDelete = (id) => {
    setList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    console.log("Edit düyməsi basıldı, ID:", id);
    const itemToEdit = list.find((item) => item.id === id);
    console.log("Redaktə ediləcək element:", itemToEdit);

    if (itemToEdit) {
      setIsEditing(true);
      setEditId(id);
    }
  };

  useEffect(() => {
    if (editId !== null) {
      const itemToEdit = list.find((item) => item.id === editId);
      if (itemToEdit) {
        setTodo({
          text: itemToEdit.text,
          duration: itemToEdit.duration,
          completed: itemToEdit.completed,
        });
      }
    }
  }, [editId]); 

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setTodo({ text: "", duration: 100, completed: false });
    setErrors({ text: "" });
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
    if (list.some((item) => item.duration === 0)) {
      setList((prevList) => prevList.filter((item) => item.duration > 0));
    }
  }, [list]);

  function toggle(id) {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form_into">
          <label style={{ fontWeight: "700", fontSize: "24px" }} htmlFor="todo">
            Todo
          </label>
          <div className="input">
            <div className="form_items">
              <input
                className="todo"
                name="text"
                value={todo.text}
                onChange={handleChange}
                placeholder={isEditing ? "Edit todo..." : "Add new todo..."}
              />
              {errors.text && <span style={{ color: "red" }}>{errors.text}</span>}
            </div>
            <button className="btn" type="submit">
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button type="button" className="btn" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>

          <div className="elements">
            {list.map((item) => (
              <div key={item.id} className="todo-item">
                <input type="checkbox" checked={item.completed} onChange={() => toggle(item.id)} />
                <label
                  style={{
                    width: "80%",
                    textDecoration: item.completed ? "line-through" : "none",
                    opacity: item.completed ? 0.7 : 1,
                  }}
                >
                  {item.text} - Time Left: {item.duration} seconds
                </label>
                <button className="edit-btn" onClick={() => handleEdit(item.id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
