import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
import "./Form.css";

const UpdateComponent = () => {
  const [component, setComponent] = useState(undefined);
  const [categories, setCategories] = useState(undefined);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState(200);
  const { id } = useParams();
  const name = useRef();
  const category = useRef();
  const manufacturer = useRef();
  const features = useRef();
  const stock = useRef();
  const price = useRef();
  const image = useRef();
  const adminpassword = useRef();
  const navigate = useNavigate();
  const update_request = (e) => {
    e.preventDefault();
    const data = new FormData();
    const refs = {
      name,
      features,
      category,
      manufacturer,
      stock,
      price,
      image,
      adminpassword,
    };
    Object.entries(refs).forEach(([key, value]) => {
      let classArr = value.current.className.split(" ");
      if (classArr[classArr.length - 1] === "is-invalid") classArr.pop();
      refs[key].current.className = classArr.join(" ");

      if (key === "image") data.append(key, value.current.files[0]);
      else if (key === "category")
        data.append(key, categories[value.current.selectedIndex]._id);
      else data.append(key, value.current.value);
    });

    const request_options = {
      method: "POST",
      body: data,
    };

    fetch(
      process.env.REACT_APP_API_URL + "/component/update/" + id,
      request_options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Component Updated")
          navigate("/component/" + res.component._id);
        else {
          JSON.parse(res.message).forEach((i) => {
            refs[i.param].current.className += " is-invalid";
          });
        }
      });
  };

  useEffect(() => {
    Promise.all([
      fetch(process.env.REACT_APP_API_URL + "/component/" + id),
      fetch(process.env.REACT_APP_API_URL + "/category/all"),
    ])
      .then((res) => {
        setStatus(Math.max(res[0].status, res[1].status));
        return Promise.all([res[0].json(), res[1].json()]);
      })
      .then((res) => {
        setComponent(res[0].component);
        setCategories(res[1].categories);
        setCategoryName(res[0].component.category.name);
      })
      .catch(()=>setStatus('NetworkError'));
  }, []);
  if (status !== 200) return <Error code={status} />;
  if (!component || !categories) return <Loading />;

  return (
    <div className="form-div">
      <h3>Update Component</h3>
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
            defaultValue={component.name}
            data-testid='name'
          />
          <div className="invalid-feedback">Name Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            name="category"
            id="category"
            ref={category}
            className="form-select"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            data-testid='category'
          >
            {categories.map((i, id) => {
              return (
                <option key={id} value={i.name}>
                  {i.name}
                </option>
              );
            })}
          </select>
          <div className="invalid-feedback">Category Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="features" className="form-label">
            Features
          </label>
          <textarea
            className="form-control"
            ref={features}
            name="features"
            id="features"
            rows="8"
            defaultValue={component.features}
            data-testid='features'
          />
          <span>*Seperate the features with comma</span>
          <div className="invalid-feedback">Features Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="manufacturer" className="form-label">
            Manufacturer
          </label>
          <input
            type="text"
            className="form-control"
            ref={manufacturer}
            name="manufacturer"
            id="manufacturer"
            defaultValue={component.manufacturer}
            data-testid='manufacturer'
          />
          <div className="invalid-feedback">Manufacturer Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            ref={price}
            name="price"
            id="price"
            defaultValue={component.price}
            data-testid='price'
          />
          <div className="invalid-feedback">Price Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            className="form-control"
            ref={stock}
            name="stock"
            id="stock"
            defaultValue={component.stock}
            data-testid='stock'
          />
          <div className="invalid-feedback">Stock Must be Specified</div>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            ref={image}
            name="image"
            id="image"
            data-testid='image'
          />
        </div>
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
            onClick={(e) => update_request(e)}
          >
            Update
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/component/all")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateComponent;
