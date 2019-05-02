import React, {Component, Fragment} from 'react';
import './style.css';

const CONSTANT = {
    LEFT_SWIPE: 'left',
    RIGHT_SWIPE: 'right',
};

class Slider extends Component {
    constructor(props) {
        super(props);

        // DOM reference
        this.carouselSlideDOM = React.createRef();

        // local variable
        this.transitionValue = 'transform 0.4s ease-in-out';
        this.size = 0;
        this.carouselSlide = null;
        this.carouselImages = null;
        this.imageList = this.props.imageList;

        // states
        this.state = {
            counter: 1,
            startX: 0,
            currentX: 0,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.loading();
        }, 100);
    }

    // Loading handler
    loading = () => {
        const carouselSlideNode = this.carouselSlideDOM.current;

        this.carouselSlide = carouselSlideNode;
        this.carouselImages = carouselSlideNode && carouselSlideNode.childNodes;

        this.size = this.carouselImages && this.carouselImages.length && this.carouselImages[0].clientWidth;
        this.getTransform();


        // TransitionEnd event Handler Binding
        carouselSlideNode.addEventListener('transitionend', () => {
            this.onTransitionEnd();
        });
    };

    // TouchStart Handler
    touchStart = (event) => {
        const touchObj = event.touches[0];
        this.setState({
            startX: touchObj.pageX,
        })
    };

    // TouchMove Handler
    touchMove = (event) => {
        const touchObj = event.touches[0];
        this.setState({
            currentX: touchObj.pageX,
        })
    };

    // TouchEnd Handler
    touchEnd = () => {
        const {startX, currentX} = this.state;
        const currentDir = startX > currentX ? CONSTANT.LEFT_SWIPE : CONSTANT.RIGHT_SWIPE;

        if (currentDir === CONSTANT.LEFT_SWIPE) {
            this.onClickNextBtn();
        }

        if (currentDir === CONSTANT.RIGHT_SWIPE) {
            this.onClickPreBtn();
        }
    };

    // OnClick Previous button Handler
    onClickPreBtn = () => {
        const {counter} = this.state;

        if (counter <= 0) return;

        this.getTransition(this.transitionValue);

        this.setState(prevState => ({
            counter: prevState.counter - 1,
        }), () => {
            this.getTransform();
        });
    };

    // OnClick Next button Handler
    onClickNextBtn = () => {
        const {counter} = this.state;

        if (counter >= this.carouselImages.length - 1) return;

        this.getTransition(this.transitionValue);

        this.setState(prevState => ({
            counter: prevState.counter + 1,
        }), () => {
            this.getTransform();
        });
    };

    // Get Slider Handler
    getSlider = () => {
        const {counter} = this.state;
        let slides = [];
        const sliderLength = this.imageList && this.imageList.length;

        if (sliderLength) {

            // All all valid slider images
            this.imageList.map((slide, index) => {
                const className = index === counter - 1 ? 'active' : '';
                const style = (index === 0) ? {transition: 'all 0.4s ease-in-out'} : null;

                const item = this.createSliderImage({slide, index, className, style});
                slides.push(item);
                return null;
            });

            // Add clone items
            const firstItemClone = this.createSliderImage({
                slide: this.imageList[0],
                index: 0 + sliderLength,
                className: 'firstClone'
            });

            const lastItemClone = this.createSliderImage({
                slide: this.imageList[sliderLength - 1],
                index: sliderLength - 1 + sliderLength,
                className: 'lastClone'
            });

            slides.unshift(lastItemClone);
            slides.push(firstItemClone);
        }

        return slides;
    };

    // Create Slider image Handler
    createSliderImage = (slideObj) => {
        const {slide, index, className, style = {}} = slideObj;
        return (
            <img
                key={`${slide && slide.alt}-${index + 1}`}
                alt={slide && slide.alt}
                src={slide && slide.imgUrl}
                className={className}
                style={style}
            />
        )
    };

    // OnTransitionEnd Handler
    onTransitionEnd = () => {
        const {counter} = this.state;

        if (this.carouselImages[counter].className === 'lastClone') {
            this.getTransition('none');

            this.setState({
                counter: this.carouselImages.length - 2,
            }, () => {
                this.getTransform();
            });
        }

        if (this.carouselImages[counter].className === 'firstClone') {
            this.getTransition('none');

            this.setState(prevState => ({
                counter: this.carouselImages.length - prevState.counter,
            }), () => {
                this.getTransform();
            });
        }
    };

    // Get Transition Handler
    getTransition = (transition) => {
        this.carouselSlide.style.transition = transition;
    };

    // Get Transform Handler
    getTransform = () => {
        const {counter} = this.state;

        this.carouselSlide.style.transform = 'translateX(' + (-this.size * counter) + 'px)';
    };

    render() {
        return (
            <Fragment>
                <div
                    className="carousel-wrapper"
                    onTouchStart={this.touchStart}
                    onTouchMove={this.touchMove}
                    onTouchEnd={this.touchEnd}
                >
                    <div className="carousel-container">
                        <div className="carousel-slide" ref={this.carouselSlideDOM}>
                            {this.getSlider()}
                        </div>
                    </div>
                    <button className="pre-btn" onClick={this.onClickPreBtn}>Pre</button>
                    <button className="next-btn" onClick={this.onClickNextBtn}>Next</button>
                </div>
            </Fragment>
        )
    }
}

export default Slider;
