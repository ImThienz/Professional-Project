import Logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
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
            <div className="headerSearch ml-3 mr-3">
              <input type="text" placeholder="Tim kiem truyen"></input>
              <button>
                <IoSearch />
              </button>
            </div>
            {/* thanh tim kiem */}
            <div className="user d-flex align-items-center ml-auto">
              <button className="circle mr-3">
                <FaUserCircle />
              </button>
              <div className="cartTab  ">
                <span className="price">55.000VND</span>
                <button className="cart ml-2 ">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
