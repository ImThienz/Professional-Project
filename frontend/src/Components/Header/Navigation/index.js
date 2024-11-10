import Button from "@mui/material/Button";
import { TiThMenuOutline } from "react-icons/ti";
import { FaAnglesDown } from "react-icons/fa6";
import "../../../App.css";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { GiMechaMask } from "react-icons/gi";
import { LiaFantasyFlightGames } from "react-icons/lia";
import { GiHumanTarget } from "react-icons/gi";
import { GrAttraction } from "react-icons/gr";
import { GiPunchBlast } from "react-icons/gi";
import React, { useState } from 'react';

const Navigation = () => {

  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);

  return (
    <nav>
      <div className="container">
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
                  <ul className="ml-3">
                    <Link to="/">
                      <GiPunchBlast /> &nbsp; Action{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3">
                    <Link to="/">
                      <GrAttraction /> &nbsp; Adventure{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3">
                    <Link to="/">
                      <GiHumanTarget /> &nbsp; Isekai{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3">
                    <Link to="/">
                      <LiaFantasyFlightGames /> &nbsp; Fantasy{" "}
                    </Link>
                  </ul>
                  <ul className="ml-3">
                    <Link to="/">
                      <GiMechaMask /> &nbsp; Mecha{" "}
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
              <li className="list-inline-item">
                <Link to="/">
                  <GiPunchBlast /> &nbsp; Action{" "}
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <GrAttraction /> &nbsp; Adventure{" "}
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <GiHumanTarget /> &nbsp; Isekai{" "}
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <LiaFantasyFlightGames /> &nbsp; Fantasy{" "}
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <GiMechaMask /> &nbsp; Mecha{" "}
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
