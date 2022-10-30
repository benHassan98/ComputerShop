import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import "./List.css";
const Categories = () => {
  const [categories, setCategories] = useState(undefined);
  const [status, setStatus] = useState(200);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/category/all")
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => setCategories(res.categories))
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!categories) return <Loading />;

  return (
    <div className="list-div">
      <Link className="btn btn-link" to={"/category/create"}>
        + Create Category
      </Link>

      <div className="list-group">
        {categories.map((i, id) => {
          return (
            <Link
              className="list-group-item list-group-item-action"
              to={"/category/" + i._id}
              key={id}
            >
              {i.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
