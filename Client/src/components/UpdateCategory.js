import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import "./Form.css";

const UpdateCategory = () => {
  const [category, setCategory] = useState(undefined);
  const [status, setStatus] = useState(200);
  const { id } = useParams();
  const adminpassword = useRef();
  const name = useRef();
  const description = useRef();
  const navigate = useNavigate();
  const update_request = (e) => {
    e.preventDefault();
    const refs = { name, description, adminpassword };
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
        adminpassword: adminpassword.current.value,
      }),
    };
    fetch(
      process.env.REACT_APP_API_URL + "/category/update/" + id,
      request_options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Category Updated") navigate("/category/" + id);
        else {
          JSON.parse(res.message).forEach((i) => {
            refs[i.param].current.className += " is-invalid";
          });
        }
      });
  };
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/category/" + id)
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => {
        setCategory(res.category);
      })
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!category) return <Loading />;
  return (
    <div className="form-div">
      <h3>Update Category</h3>
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
            defaultValue={category.name}
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
            defaultValue={category.description}
          />
          <div className="invalid-feedback">Description Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="adminpassword" className="form-label">
            Admin Password
          </label>
          <input
            type="password"
            className="form-control"
            id="adminpassword"
            name="adminpassword"
            data-testid='adminpassword'
            ref={adminpassword}
          />
          <div className="invalid-feedback">Wrong Admin Password</div>
        </div>
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => update_request(e)}
          >
            Update
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/category/" + id)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
