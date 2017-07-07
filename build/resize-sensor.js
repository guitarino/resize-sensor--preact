'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require('preact');

var _preact2 = _interopRequireDefault(_preact);

require('./raf');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright Kirill Shestakov 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://github.com/guitarino/resize-sensor--preact/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ----
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Rework of https://github.com/procurios/ResizeSensor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var style = '.resize-sensor-preact,.resize-sensor-preact > div,.resize-sensor-preact .resize-sensor-preact__contract-child{display:block;position:absolute;top:0px;left:0px;height:100%;width:100%;opacity:0;overflow:hidden;pointer-events:none;z-index:-1;}.resize-sensor-preact{background:#eee;overflow:auto;direction:ltr;}.resize-sensor-preact .resize-sensor-preact__contract-child{width:200%;height:200%;}@keyframes resize-sensor-preact-animation{from{opacity:0;}to{opacity:0;}}@-webkit-keyframes resize-sensor-preact-animation{from{opacity:0;}to{opacity:0;}}@-moz-keyframes resize-sensor-preact-animation{from{opacity:0;}to{opacity:0;}}@-o-keyframes resize-sensor-preact-animation{from{opacity:0;}to{opacity:0;}}.resize-sensor-preact{-webkit-animation-name:resize-sensor-preact-animation;-moz-animation-name:resize-sensor-preact-animation;-o-animation-name:resize-sensor-preact-animation;-ms-animation-name:resize-sensor-preact-animation;animation-name:resize-sensor-preact-animation;-webkit-animation-duration:1ms;-moz-animation-duration:1ms;-o-animation-duration:1ms;-ms-animation-duration:1ms;animation-duration:1ms;}';


var
// this is for ie9
supportsAttachEvent = 'attachEvent' in document,

// needed so that we just insert <style> once
styleInitialized = false,

// animation start events with varied prefixes
animStart = ['webkitAnimationStart', 'animationstart', 'oAnimationStart', 'MSAnimationStart'],

// the easiest way is to just insert a style
// into <style> tag so that all resize sensors
// share the same style
insertCSS = function insertCSS(css) {
  var where = document.head || document.body || document.documentElement;
  var style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  where.appendChild(style);
};

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

var ResizeSensor = function (_preact$Component) {
  _inherits(ResizeSensor, _preact$Component);

  function ResizeSensor() {
    _classCallCheck(this, ResizeSensor);

    // when invisible, <ResizeSensor/> size is 0x0
    var _this = _possibleConstructorReturn(this, (ResizeSensor.__proto__ || Object.getPrototypeOf(ResizeSensor)).call(this));

    _this.dimensions = {
      width: 0,
      height: 0
    };
    // binding (needed for requestAnimationFrame callback)
    _this.onElementResize = _this.onElementResize.bind(_this);
    return _this;
  }

  // as you can see, there's triggers that "listen" to expansion
  // and triggers that "listen" to contraction


  _createClass(ResizeSensor, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _preact2.default.h(
        'div',
        { 'class': 'resize-sensor-preact', ref: function ref(e) {
            _this2.self = e;
          } },
        _preact2.default.h(
          'div',
          { 'class': 'resize-sensor-preact__expand', ref: function ref(e) {
              _this2.expand = e;
            } },
          _preact2.default.h('div', { 'class': 'resize-sensor-preact__expand-child', ref: function ref(e) {
              _this2.expandChild = e;
            } })
        ),
        _preact2.default.h(
          'div',
          { 'class': 'resize-sensor-preact__contract', ref: function ref(e) {
              _this2.contract = e;
            } },
          _preact2.default.h('div', { 'class': 'resize-sensor-preact__contract-child' })
        )
      );
    }

    // initially, when no element is mounted yet,
    // insert style into DOM

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (!styleInitialized) {
        styleInitialized = true;
        insertCSS(style);
      }
    }

    // never update element, just render once

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }

    // overriding onResize if props are updated

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
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

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setOnResize(this.props);
      // ie9 only
      if (supportsAttachEvent) {
        this.self.attachEvent('onresize', this.onElementResize);
      }
      // other browsers
      else {
          this.self.addEventListener('scroll', this, true);
          for (var i = 0; i < animStart.length; i++) {
            this.self.addEventListener(animStart[i], this);
          }
          // Initial value reset of all triggers
          this.resetTriggers();
        }
    }

    // When element is unmounted, need to remove all

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // ie9 only
      if (supportsAttachEvent) {
        this.self.detachEvent('onresize', this.onElementResize);
      }
      // other browsers
      else {
          for (var i = 0; i < animStart.length; i++) {
            this.self.removeEventListener(animStart[i], this);
          }
          this.self.removeEventListener('scroll', this, true);
        }
    }

    // if there's no 'onResize' prop, then we'll fall back
    // to this onResize, which will do nothing

  }, {
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'setOnResize',
    value: function setOnResize(props) {
      if ('onResize' in props) {
        this.onResize = props.onResize;
      }
    }

    // using addEventListener's handleEvent ability
    // so that we don't have to deal with binding

  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      // on scroll, debounce-ish
      if (e.type === 'scroll') {
        this.resetTriggers();
        if (this.resizeRAF) {
          window.cancelAnimationFrame(this.resizeRAF);
        }
        this.resizeRAF = window.requestAnimationFrame(this.onElementResize);
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

  }, {
    key: 'onElementResize',
    value: function onElementResize() {
      var currentDimensions = this.getDimensions();
      if (this.isResized(currentDimensions)) {
        this.dimensions.width = currentDimensions.width;
        this.dimensions.height = currentDimensions.height;
        this.onResize(this.dimensions.width, this.dimensions.height);
      }
    }

    // just checking if either dimension changed

  }, {
    key: 'isResized',
    value: function isResized(currentDimensions) {
      return currentDimensions.width !== this.dimensions.width || currentDimensions.height !== this.dimensions.height;
    }

    // returning current dimensions of the resize sensor

  }, {
    key: 'getDimensions',
    value: function getDimensions() {
      return {
        width: this.self.offsetWidth,
        height: this.self.offsetHeight
      };
    }

    // this implements the idea behind resize sensor

  }, {
    key: 'resetTriggers',
    value: function resetTriggers() {
      this.contract.scrollLeft = this.contract.scrollWidth;
      this.contract.scrollTop = this.contract.scrollHeight;
      this.expandChild.style.width = this.expand.offsetWidth + 1 + 'px';
      this.expandChild.style.height = this.expand.offsetHeight + 1 + 'px';
      this.expand.scrollLeft = this.expand.scrollWidth;
      this.expand.scrollTop = this.expand.scrollHeight;
    }
  }]);

  return ResizeSensor;
}(_preact2.default.Component);

exports.default = ResizeSensor;
//# sourceMappingURL=resize-sensor.js.map