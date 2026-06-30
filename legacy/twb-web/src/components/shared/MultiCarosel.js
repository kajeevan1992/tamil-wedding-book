import React from 'react'
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";

export default function MultiCarosel({ children, lg = 4, tab = 2, mobile = 1, }) {
  const [play, setPlay] = React.useState(true);
  const carouselRef = React.useRef(null)

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: lg,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: lg,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: tab,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: mobile,
    },
  };

  return (
    <div className='row justify-content-center '>

      <div className='col-9 col-sm-12 position-relative'>
        <button
          type="button"
          role="presentation"
          className="owl-prev own-prev-btn-11"
          onClick={() => carouselRef?.current?.previous()}
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        <Carousel
          ref={carouselRef}
          responsive={responsive}
          autoPlay={play}
          centerMode={false}
          focusOnSelect={true}
          minimumTouchDrag={80}
          ssr={true}
          renderButtonGroupOutside={true}
          renderDotsOutside={true}
          keyBoardControl={true}
          swipeable
          // removeArrowOnDeviceType={["tablet", "mobile"]}
          autoPlaySpeed={3000}
          showDots={false}
          infinite={true}
          arrows={false}
        // customRightArrow={<CustomRightArrow />}
        // customLeftArrow={<CustomLeftArrow />}

        >
          {children}
        </Carousel>
        <button
          type="button"
          role="presentation"
          className="owl-prev own-next-btn-11"
          onClick={() => carouselRef?.current?.next()}
        >
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>

    </div>

  )
}
