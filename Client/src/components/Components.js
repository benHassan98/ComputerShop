import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Loading from "./Loading";
import Error from "./Error";
import splitArray from "./helpers/splitArray";
const Components = () => {
  const [components, setComponents] = useState(undefined);
  const [imageStrings, setImageStrings] = useState([]);
  const [status, setStatus] = useState(200);
  const [cookies, setCookies] = useCookies(["components"]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/component/all")
      .then((res) => {
        setStatus(res.status);
        return res.json();
      })
      .then((res) => {
        const strArr = [];
        res.components.forEach((component) => {
          let str = "";
          splitArray(component.image.data.data).forEach((i) => {
            str += String.fromCharCode(...i);
          });
          strArr.push(
            "data:" + component.image.contentType + ";base64," + btoa(str)
          );
        });

        setComponents(res.components);
        setImageStrings(strArr);
      })
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!components) return <Loading />;

  return (
    <div>
      <Link to={"/component/create"}>+ Create Component</Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Manufacturer</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {components.map((i, id) => {
            return (
              <tr key={id}>
                <th scope="row">
                  <img
                    src={imageStrings[id]}
                    alt={i.name}
                    style={{ width: "40px", height: "40px" }}
                  />
                 <Link to={'/component/'+i._id}>{" " + i.name}</Link>
                </th>
                <td><Link to={'/category/'+i.category._id}>{i.category.name}</Link></td>
                <td>{i.manufacturer}</td>
                <td>{"$ " + i.price}</td>
                <td>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      addToCart(i);
                      if ( !cookies.components ||
                        (cookies.components &&
                          !cookies.components.includes(i._id)))
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Components;
