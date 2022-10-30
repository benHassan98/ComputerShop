import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { CartContext } from "./CartContext";
import Loading from "./Loading";
import Error from "./Error";
import { useNavigate, Link } from "react-router-dom";
import splitArray from "./helpers/splitArray";
import "./HomePage.css";

const App = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [categories, setCategories] = useState(undefined);
  const [status, setStatus] = useState(200);
  const [cookies, setCookies] = useCookies(["components"]);
  const navigate = useNavigate();

  let total = 0;
  let imageStrings = {};

  Object.entries(cart).forEach(([categoryName, component]) => {
    let str = "";
    total += component.price;
    splitArray(component.image.data.data).forEach((i) => {
      str += String.fromCharCode(...i);
    });
    imageStrings[categoryName] =
      "data:" + component.image.contentType + ";base64," + btoa(str);
  });
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/category/all")
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => setCategories(res.categories))
      .catch(() => setStatus("NetworkError"));
  }, []);
  useEffect(() => {
    (async () => {
      try {
        if (cookies.components) {
          await Promise.all(
            cookies.components.map(async (i) => {
              const res = await fetch(
                process.env.REACT_APP_API_URL + "/component/" + i
              );
              setStatus(Math.max(status, res.status));
              const res_component = await res.json();
              addToCart(res_component.component);
            })
          );
        }
      } catch (err) {
        setStatus("NetworkError");
      }
    })();
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!categories) return <Loading />;

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Selection</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {categories.map((i, id) => {
            return cart[i.name] ? (
              <tr key={id}>
                <th scope="row">{i.name}</th>
                <td>
                  <img
                    src={imageStrings[i.name]}
                    alt={cart[i.name].name}
                    style={{ width: "40px", height: "40px" }}
                  />
                  <Link to={"/component/" + i._id}>
                    {" " + cart[i.name].name}
                  </Link>
                </td>
                <td>{"$" + cart[i.name].price}</td>
                <td>
                  <div className="btns">
                    <button className="btn btn-outline-primary">
                      <a
                        href={"https://www.amazon.com/s?k=" + cart[i.name].name}
                        target="_blank"
                      >
                        Buy
                      </a>
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        removeFromCart(i.name);
                        setCookies("components", cookies.components.filter(id=> id !== i));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={id}>
                <th scope="row">{i.name}</th>
                <td>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/category/" + i._id)}
                  >
                    {"Choose " + i.name}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>{"Total: $" + total}</p>
    </div>
  );
};

export default App;
