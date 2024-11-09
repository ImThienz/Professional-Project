import Button from '@mui/material/Button';
import { TiThMenuOutline } from "react-icons/ti";
import { FaAnglesDown } from "react-icons/fa6";
import "../../../App.css";
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { GiMechaMask } from "react-icons/gi";
import { LiaFantasyFlightGames } from "react-icons/lia";
import { IoIosContacts } from "react-icons/io";
import { GiHumanTarget } from "react-icons/gi";
import { GrAttraction } from "react-icons/gr";
import { GiPunchBlast } from "react-icons/gi";


const Navigation=()=>{
    return(
        <nav>
            <div className="container">
                <div className='row'>
                    <div className="col-sm-3 navPart1">
                    <Button className="allCatTab align-items-center">
                        <span className='icon1'>
                            <TiThMenuOutline />&nbsp;
                        </span>
                        <span className="text">DANH MỤC</span>

                        <span className='icon2'>
                            &nbsp;<FaAnglesDown />
                        </span>
                    </Button>
                    </div>

                    <div className="col-sm-9 navPart2 d-flex align-items-center">
                        <ul className='list list-inline ml-alto'>
                            <li className='list-inline-item'><Link to="/"><FaHome/> &nbsp; Home</Link></li>
                            <li className='list-inline-item'><Link to="/"><GiPunchBlast/> &nbsp; Action </Link></li>
                            <li className='list-inline-item'><Link to="/"><GrAttraction/> &nbsp; Adventure  </Link></li>
                            <li className='list-inline-item'><Link to="/"><GiHumanTarget/> &nbsp; Isekai </Link></li>
                            <li className='list-inline-item'><Link to="/"><LiaFantasyFlightGames/> &nbsp; Fantasy </Link></li>
                            <li className='list-inline-item'><Link to="/"><GiMechaMask/> &nbsp; Mecha </Link></li>
                            <li className='list-inline-item'><Link to="/"><IoIosContacts/> &nbsp; Contact Us </Link></li>

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
    )
}

export default Navigation;