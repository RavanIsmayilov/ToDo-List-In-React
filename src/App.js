import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { validate } from "./helpers";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  const [todo, setTodo] = useState({
    text: "",
    duration: 100,
  });

  const [errors, setErrors] = useState({
    text: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
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

    if (errors.text.length > 0 && ( todo.text.trim() === "" || isEditing)) {
      setErrors({ text: "Todo text cannot be empty" });
      return;
    } else if (isEditing) {

      // Update the existing todo
      const updatedList = list.map((item) =>
        item.id === editId ? { ...item, text: todo.text } : item
      );
      setList(updatedList);

      // Reset the editing state after updating
      setEditId(null);
      setIsEditing(false);
    } else {
      // Add a new todo
      const newTodo = {
        ...todo,
        id: uniqid(),
      };
      setList([...list, newTodo]);
    }

    // Clear the input after submission
    setTodo({
      text: "",
      duration: 100,
    });

    // Clear errors after successful submission or update
    setErrors({
      text: "",
    });
  };

  const handleDelete = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  const handleEdit = (id, text) => {
    setIsEditing(true); // Set the editing mode to true
    setEditId(id); // Store the id of the item being edited
    setTodo({
      ...todo,
      text, // Populate the input field with the selected todo text
    });
  };

  // Added a cancel button functionality to cancel the editing process
  const handleCancel = () => {
    setIsEditing(false);
    setTodo({
      text: "",
      completed: false,
      duration: 100,
    });
    setErrors({
      text: "",
    });
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
      setList((prevList) => prevList.filter((item) => item.duration > 0));
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
              {errors.text && (
                <span style={{ color: "red" }}>{errors.text}</span>
              )}
            </div>
            <button className="btn" type="submit">
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="elements">
            {list.map((item) => (
              <div key={item.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggle(item.id)} // Use onChange to toggle checkbox state
                />
                <label
                  style={{
                    width: "80%",
                    textDecoration: item.completed ? "line-through" : "none",
                    opacity: item.completed ? 0.7 : 1,
                  }}
                >
                  {item.text} - Time Left: {item.duration} seconds
                </label>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(item.id, item.text)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
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
