import Button from "@mui/material/Button";
import { TiThMenuOutline } from "react-icons/ti";
import { FaAnglesDown } from "react-icons/fa6";
import "../../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { GiMechaMask } from "react-icons/gi";
import { LiaFantasyFlightGames } from "react-icons/lia";
import { GiHumanTarget } from "react-icons/gi";
import { GrAttraction } from "react-icons/gr";
import { GiPunchBlast } from "react-icons/gi";
import React, { useState } from 'react';
import navigation from "../../../Assets/navigate.jpg";
import axios from 'axios';

const Navigation = () => {

  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
  // const [comics, setComics] = React.useState([]);
  // const [error, setError] = useState(null); // State for error handling

  // // Function to fetch comics by category
  // const fetchComicsByCategory = async (genre) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/api/comics/category/${genre}`
  //     );
  //     setComics(response.data); // Set comics data
  //     setError(null); // Clear error if successful
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message || "Không thể lấy dữ liệu. Vui lòng thử lại!"
  //     ); // Handle error message
  //     setComics([]); // Clear comics data
  //   }
  // };

  const navigate = useNavigate();

  const handleCategoryClick = (genre) => {
    // Điều hướng sang HomePage với thể loại
    navigate("/", { state: { genre } });
  };

  return (
    <nav>
      <div className="container" style={{
        backgroundImage: `url(${navigation})`, // Áp dụng ảnh cho form
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        borderRadius: "10px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng
        minWidth: "800px", 
        margin: "0 auto",
        color: "black", 
        opacity: "75%",
      }}>
        <div className="row">
          <div className="col-sm-3 navPart1">
            <div className="cartWrapper">
              <Button className="allCatTab align-items-center" onClick={
                ()=>setisopenSidebarVal(!isopenSidebarVal)}>
                <span className="icon1 mr-2">
                  <TiThMenuOutline />
                  &nbsp;
                </span>
                <span class="text">DANH MỤC</span>

                <span className="icon2 ml-2">
                  &nbsp;
                  <FaAnglesDown />
                </span>
              </Button>

              <div className={`sidebarNav ${isopenSidebarVal===true ? 'open': ''} `}>
                <ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Action")}>
                    <Link to="#">
                      <GiPunchBlast /> &nbsp; Action{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Adventure")}>
                    <Link to="#">
                      <GrAttraction /> &nbsp; Adventure{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Supernatural")}>
                    <Link to="#">
                      <GiHumanTarget /> &nbsp; Supernatural{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Fantasy")}>
                    <Link to="#">
                      <LiaFantasyFlightGames /> &nbsp; Fantasy{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Dark Fantasy")}>
                    <Link to="#">
                      <LiaFantasyFlightGames /> &nbsp; Dark Fantasy{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3"onClick={() => handleCategoryClick("Thriller")}>
                    <Link to="#">
                      <GiMechaMask /> &nbsp; Thriller{" "}
                    </Link>
                  </ul>
                </ul>
              </div>

            </div>
          </div>

          <div className="col-sm-9 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-alto">
              <li className="list-inline-item">
                <Link to="/">
                  <FaHome /> &nbsp; Home
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Action")}>
                <Link to="#">
                  <GiPunchBlast /> &nbsp; Action{" "}
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Adventure")}>
                <Link to="#">
                  <GrAttraction /> &nbsp; Adventure{" "}
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Supernatural")}>
                <Link to="#">
                  <GiHumanTarget /> &nbsp; Supernatural{" "}
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Fantasy")}>
                <Link to="#">
                  <LiaFantasyFlightGames /> &nbsp; Fantasy{" "}
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Dark Fantasy")}>
                <Link to="#">
                  <LiaFantasyFlightGames /> &nbsp; Dark Fantasy{" "}
                </Link>
              </li>
              <li className="list-inline-item"onClick={() => handleCategoryClick("Thriller")}>
                <Link to="#">
                  <GiMechaMask /> &nbsp; Thriller{" "}
                </Link>
              </li>

              {/* 
                            <li className='list-inline-item'><Link to="/">Romance </Link></li>
                            <li className='list-inline-item'><Link to="/">Josei</Link></li>
                            <li className='list-inline-item'><Link to="/">Horror </Link></li>
                            <li className='list-inline-item'><Link to="/">Comedy </Link></li>
                            <li className='list-inline-item'><Link to="/">Slice of Life </Link></li>
                            <li className='list-inline-item'><Link to="/">Shounen </Link></li>
                            <li className='list-inline-item'><Link to="/">Shoujo </Link></li>
                            <li className='list-inline-item'><Link to="/">Seinen </Link></li> */}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
