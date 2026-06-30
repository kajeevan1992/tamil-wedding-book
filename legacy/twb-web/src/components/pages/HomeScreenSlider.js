import React from 'react'
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import HomeSliderContent from './HomeSliderContent';
export default function HomeScreenSlider(props) {
    const [play, setPlay] = React.useState(true);

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };
    return (
        <>
            <section className="slider-wrap home-slider">
                <Carousel
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
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    autoPlaySpeed={3000}
                    showDots={true}
                    infinite={true}
                >
                    <div className="item" key="Slide 1">
                        <div className="home-slider-img">
                            <img src="/assets/images/slider/slider_img_1.jpg" alt="" style={{ height: '100%' }} />
                        </div>
                    </div>
                    <div className="item" key="Slide 2">
                        <div className="home-slider-img">
                            <img src="/assets/images/about/pexels-trung-nguyen-1751682.jpg" alt="" style={{ height: '100%' }} />
                        </div>
                    </div>
                    <div className="item" key="Slide 3">
                        <div className="home-slider-img">
                            <img src="/assets/images/slider/slider_img_1.jpg" style={{ height: '100%' }} alt="" />
                        </div>
                    </div>
                    <div className="item" key="Slide 4">
                        <div className="home-slider-img">
                            <img src="/assets/images/about/pexels-trung-nguyen-1751682.jpg" alt="" style={{ height: '100%' }} />
                        </div>
                    </div>
                </Carousel>

                <HomeSliderContent app={props.app} />
            </section>
        </>
    );
}