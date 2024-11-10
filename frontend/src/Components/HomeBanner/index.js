import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import "../../App.css";


const HomeBanner=()=>{

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, 
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
      };

    return(
        <div className="homeBannerSection">
            <Slider {...settings}>
                <div className="item">
                    <img src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1731076081/1731076080475_New_Project_12.jpg" className="w-100"/>
                    {/* <img src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1731076096/1731076096038_New_Project_6.jpg" className="w-100"/>
                    <img src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1731076155/1731076154714_New_Project_11.jpg" className="w-100"/>
                    <img src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1731076185/1731076185169_New_Project_27.jpg" className="w-100"/> */}

                </div>
            </Slider>
        </div>
    )
}

export default HomeBanner;