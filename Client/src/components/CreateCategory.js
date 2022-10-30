import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const CreateCategory = () => {
  const name = useRef();
  const description = useRef();
  const navigate = useNavigate();
  const create_request = (e) => {
    e.preventDefault();
    const refs = { name, description };
    Object.entries(refs).forEach(([key, value]) => {
      let classArr = value.current.className.split(" ");
      if (classArr[classArr.length - 1] === "is-invalid") classArr.pop();
      refs[key].current.className = classArr.join(" ");
    });
    const request_options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.current.value,
        description: description.current.value,
      }),
    };
    fetch(process.env.REACT_APP_API_URL + "/category/create", request_options)
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Category Saved")
          navigate("/category/" + res.category._id);
        else {
          JSON.parse(res.message).forEach((i) => {
            refs[i.param].current.className += " is-invalid";
          });
        }
      });
  };
  return (
    <div className="form-div">
      <h3>Create Category</h3>

      <form data-testid='form'>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            ref={name}
            name="name"
            id="name"
            data-testid='name'
          />
          <div className="invalid-feedback">Name Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            ref={description}
            name="description"
            id="description"
            rows="5"
            data-testid='description'
          />
          <div className="invalid-feedback">Description Must be Specified</div>
        </div>
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => create_request(e)}
          >
            Create
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/category/all")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
