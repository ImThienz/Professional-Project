import Logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
//import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import Button from '@mui/material/Button';
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
const Header = () => {
  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg-color">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Trang web doc truyen cua nhom 6
            </p>
          </div>
        </div>
        <header className="header">
        <div className="container-fluid">
          <div className="row">
            <div className="logoWrapper col-sm-2 d-flex align-items-center">
              <Link to="/">
                <img src={Logo} alt="Logo"></img>
              </Link>
            </div>
            {/* thanh tim kiem */}
            
            {/* thanh tim kiem */}

            <SearchBox/>

            <div className="user d-flex align-items-center ml-auto">
              <Button className="circle mr-3">
                <FaUserCircle />
              </Button>
              <div className="cartTab  ">
                <span className="price">55.000VND</span>
                <Button className="cart ml-3 ">
                  <FaShoppingCart />
                </Button>
              </div>
            </div>
          </div>
        </div>
        </header>

        <Navigation/>
        
      </div>

    </>
  );
};
export default Header;
