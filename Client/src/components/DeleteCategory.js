import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import "./Form.css";
import "./List.css";

const DeleteCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(undefined);
  const [components, setComponents] = useState(undefined);
  const [status, setStatus] = useState(200);
  const adminpassword = useRef();
  const navigate = useNavigate();
  const delete_request = (e) => {
    e.preventDefault();
    const request_options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminpassword: adminpassword.current.value }),
    };
    fetch(
      process.env.REACT_APP_API_URL + "/category/delete/" + id,
      request_options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Category Deleted") navigate("/");
        else adminpassword.current.className += " is-invalid";
      });
  };

  useEffect(() => {
    Promise.all([
      fetch(process.env.REACT_APP_API_URL + "/category/" + id),
      fetch(process.env.REACT_APP_API_URL + "/component/all"),
    ])
      .then((res) => {
        setStatus(Math.max(res[0].status, res[1].status));
        return Promise.all([res[0].json(), res[1].json()]);
      })
      .then((res) => {
        setCategory(res[0].category);
        setComponents(res[1].components.filter((i) => i.category._id === id));
      })
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!category || !components) return <Loading />;
  if (components.length) {
    return (
      <div className="list-div">
        <h3>Delete Category: {category.name}</h3>
        <h5>Must delete the following parts before removing this category</h5>
        <div className="list-group">
          {components.map((i, id) => {
            return (
              <Link
                className="list-group-item list-group-item-action"
                to={"/component/" + i._id}
                key={id}
              >
                {i.name}
              </Link>
            );
          })}
        </div>
        <div className="d-grid gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/category/" + id)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="form-div">
        <h3>Delete Category: {category.name}</h3>
        <h5>Are you sure you want to delete this category?</h5>
        <form data-testid='form'>
          <div className="mb-3">
            <label htmlFor="adminpassword" className="form-label">
              Admin Password
            </label>
            <input
              type="password"
              className="form-control"
              name="adminpassword"
              id="adminpassword"
              ref={adminpassword}
              data-testid='adminpassword'
            />
            <div className="invalid-feedback">Wrong Admin Password</div>
          </div>
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => delete_request(e)}
            >
              Delete
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
  }
};
export default DeleteCategory;
