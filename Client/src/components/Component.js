import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import Loading from "./Loading";
import Error from "./Error";
import "./Component.css";
import splitArray from "./helpers/splitArray";

const Component = () => {
  const { addToCart } = useContext(CartContext);
  const [component, setComponent] = useState(undefined);
  const [imageString, setImageString] = useState("");
  const [status, setStatus] = useState(200);
  const [cookies, setCookies] = useCookies(["components"]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/component/" + id)
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => {
        let str = "";
        splitArray(res.component.image.data.data).forEach((i) => {
          str += String.fromCharCode(...i);
        });

        setComponent(res.component);
        setImageString(
          "data:" + res.component.image.contentType + ";base64," + btoa(str)
        );
      })
      .catch(() => setStatus("NetworkError"));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!component) return <Loading />;

  return (
    <div className="component-container">
      <div className="sub-1">
        <h3 className="text-center">{component.name}</h3>
        <div className="mod">
          <Link className="btn btn-link" to={"/component/update/" + id}>
            Update
          </Link>
          <Link className="btn btn-link" to={"/component/delete/" + id}>
            Delete
          </Link>
        </div>
        <img src={imageString} alt={component.name} />
        <button
          className="btn btn-primary"
          onClick={() => {
            addToCart(component);
            if (cookies.components && cookies.components.indexOf(i) === -1)
              setCookies(
                "components",
                [...(cookies.components ? cookies.components : []), i._id],
                { SameSite: false }
              );
            navigate("/");
          }}
        >
          Add
        </button>
      </div>
      <div className="sub-2">
        <div className="div1">
          <div className="info">
            <div>Category</div>
            <div>
              <Link to={"/category/" + component.category._id}>
                {component.category.name}
              </Link>
            </div>
          </div>
          <div className="info">
            <div>Manufacturer</div>
            <div>{component.manufacturer}</div>
          </div>
          <div className="info">
            <div>Price</div>
            <div>{"$" + component.price}</div>
          </div>
          <div className="info">
            <div>Stock</div>
            <div>{component.stock}</div>
          </div>
        </div>
        <div className="div2">
          <div>Features</div>
          <ul className="list-group list-group-flush">
            {component.features.split(",").map((i, id) => {
              return (
                <li key={id} className="list-group-item">
                  {i}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Component;
