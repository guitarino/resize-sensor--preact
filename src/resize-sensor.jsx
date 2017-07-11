/**
 * @license MIT
 * @copyright Kirill Shestakov 2017
 * @see https://github.com/guitarino/resize-sensor--preact/
 * ----
 * Rework of https://github.com/procurios/ResizeSensor
 */

import preact from 'preact';
import './raf';

var
  // this is for ie9
  supportsAttachEvent,
  // animation start events with varied prefixes
  animStart = [
    'webkitAnimationStart',
    'animationstart',
    'oAnimationStart',
    'MSAnimationStart'
  ]
;

try {
  supportsAttachEvent = ('attachEvent' in document);
}
catch(probablyDoingSSR) {
  supportsAttachEvent = false;
}

// essentially, this is the idea:
//
//   we have contraction and expansion triggers,
//   each of them have children
//
//   for contraction:
//     the child is 2x bigger than container,
//     and it's always scrolled to the bottom right,
//     so, when contracted, the bottom right scroll
//     position changes, and the 'scroll' event gets called
//
//   for expansion:
//     the child is slightly bigger than container,
//     and it's always scrolled to the bottom right,
//     so, when the container expands, the scrollbar
//     disappears and changes the child's scroll position
//
export default class ResizeSensor extends preact.Component {
  constructor() {
    super();
    // when invisible, <ResizeSensor/> size is 0x0
    this.dimensions = {
      width: 0,
      height: 0
    };
    // binding (needed for requestAnimationFrame callback)
    this.onElementResize = this.onElementResize.bind(this);
  }

  // as you can see, there's triggers that "listen" to expansion
  // and triggers that "listen" to contraction
  render() {
    return (
      <div class='resize-sensor-preact' ref={(e) => {this.self = e}}>
        <div class="resize-sensor-preact__expand" ref={(e) => {this.expand = e}}>
          <div class="resize-sensor-preact__expand-child" ref={(e) => {this.expandChild = e}}></div>
        </div>
        <div class="resize-sensor-preact__contract" ref={(e) => {this.contract = e}}>
          <div class="resize-sensor-preact__contract-child"></div>
        </div>
      </div>
    );
  }

  // never update element, just render once
  shouldComponentUpdate() {
    return false;
  }
  
  // overriding onResize if props are updated
  componentWillReceiveProps(props) {
    this.setOnResize(props);
  }

  // when component is mounted, we just need to attach handlers
  // scroll - needed for detecting resize
  // animation start - needed detecting visibility (we need to
  //   trigger initial update once the element becomes visible
  //   because the size might have changed)
  //
  // Note: using addEventListener's ability to trigger `handleEvent`
  //       so that we don't have to deal with binding
  componentDidMount() {
    this.setOnResize(this.props);
    // ie9 only
    if (supportsAttachEvent) {
      this.self.attachEvent('onresize', this.onElementResize);
    }
    // other browsers
    else {
      this.self.addEventListener('scroll', this, true);
      for (var i=0; i<animStart.length; i++) {
        this.self.addEventListener(animStart[i], this);
      }
      // Initial value reset of all triggers
      this.resetTriggers();
    }
  }

  // When element is unmounted, need to remove all
  componentWillUnmount() {
    // ie9 only
    if (supportsAttachEvent) {
      this.self.detachEvent('onresize', this.onElementResize);
    }
    // other browsers
    else {
      for (var i=0; i<animStart.length; i++) {
        this.self.removeEventListener(animStart[i], this);
      }
      this.self.removeEventListener('scroll', this, true);
    }
  }

  // if there's no 'onResize' prop, then we'll fall back
  // to this onResize, which will do nothing
  onResize() { }

  setOnResize(props) {
    if ('onResize' in props) {
      this.onResize = props.onResize;
    }
  }

  // using addEventListener's handleEvent ability
  // so that we don't have to deal with binding
  handleEvent(e) {
    // on scroll, debounce-ish
    if (e.type === 'scroll') {
      this.resetTriggers();
      if (this.resizeRAF) {
        window.cancelAnimationFrame(
          this.resizeRAF
        );
      }
      this.resizeRAF = window.requestAnimationFrame(
        this.onElementResize
      );
    }
    // when element becomes visible, reset the trigger sizes;
    // the scroll will be triggered if sizes changed
    else {
      if (e.animationName === 'resize-sensor-preact-animation') {
        this.resetTriggers();
      }
    }
  }

  // check if actually resized, call the callback
  onElementResize() {
    var currentDimensions = this.getDimensions();
    if (this.isResized(currentDimensions)) {
      this.dimensions.width = currentDimensions.width;
      this.dimensions.height = currentDimensions.height;
      this.onResize(this.dimensions.width, this.dimensions.height);
    }
  }

  // just checking if either dimension changed
  isResized(currentDimensions) {
    return (
      currentDimensions.width !== this.dimensions.width ||
      currentDimensions.height !== this.dimensions.height
    );
  }

  // returning current dimensions of the resize sensor
  getDimensions() {
    return {
      width: this.self.offsetWidth,
      height: this.self.offsetHeight
    };
  }

  // this implements the idea behind resize sensor
  resetTriggers() {
    this.contract.scrollLeft = this.contract.scrollWidth;
    this.contract.scrollTop = this.contract.scrollHeight;
    this.expandChild.style.width = (this.expand.offsetWidth + 1) + 'px';
    this.expandChild.style.height = (this.expand.offsetHeight + 1) + 'px';
    this.expand.scrollLeft = this.expand.scrollWidth;
    this.expand.scrollTop = this.expand.scrollHeight;
  }
}