import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import "./Form.css";

const DeleteComponent = () => {
  const [component, setComponent] = useState(undefined);
  const [status, setStatus] = useState(200);
  const { id } = useParams();
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
      process.env.REACT_APP_API_URL + "/component/delete/" + id,
      request_options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Component Deleted") navigate("/");
        else adminpassword.current.className += " is-invalid";
      });
  };
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/component/" + id)
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => setComponent(res.component))
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status}/>;
  if (!component) return <Loading />;

  return (
    <div className="form-div">
      <h3>Delete Component: {component.name}</h3>
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
            onClick={() => navigate("/component/" + id)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default DeleteComponent;
