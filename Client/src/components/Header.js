import React from "react";
import { Link } from "react-router-dom";
const Header = ()=>{

return(
<div className="container">
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <h4  className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <span className="fs-4">Computer Shop</span>
      </h4>

      <ul className="nav nav-pills">
        <li className="nav-item"><Link className="nav-link" to='/'>Home</Link></li>
        <li className="nav-item"><Link className="nav-link" to='/category/all'>All Categories</Link></li>
        <li className="nav-item"><Link className="nav-link" to='/component/all'>All Components</Link></li>
      </ul>
    </header>
  </div>

);    
}


export default Header;
