import React, { Component, Fragment } from 'react';
import './App.css';
import Slider from './components/Slider';

class App extends Component {
  constructor(props) {
    super(props);
    this.imageList = [
      {imgUrl: '/images/slide-1.jpeg', alt: "slide 1"},
      {imgUrl: '/images/slide-2.jpeg', alt: "slide 2"},
      {imgUrl: '/images/slide-3.jpeg', alt: "slide 3"},
      {imgUrl: '/images/slide-4.jpeg', alt: "slide 4"},
      {imgUrl: '/images/slide-5.jpeg', alt: "slide 5"}
    ];
  }

  render() {
    return (
        <Fragment>
          <h3>Flexible Swipe Slider</h3>
          <Slider imageList={this.imageList} />
        </Fragment>
    );
  }
}

export default App;