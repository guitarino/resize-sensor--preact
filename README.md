# Resize Sensor for Preact

A Preact component based on work by [procurios](https://github.com/procurios/ResizeSensor). It is an element that triggers a callback whenever the size (width or height) of its container changes. [See React version here](https://github.com/guitarino/resize-sensor--react).

## How to install it

```
npm install --save resize-sensor--preact
```

## How to use it

```javascript
import preact from 'preact';
import ResizeSensor from 'resize-sensor--preact';

class App extends preact.Component {
  constructor() {
    super();
    this.state = {w: 0, h: 0};
  }
  render() {
    return (
      <div style={{width: '50vw', height: '50vh', position: 'relative'}}>
        <ResizeSensor
          onResize={(w,h) => this.setState({w: w, h: h})}
        />
        <div>Width: {this.state.w}px</div>
        <div>Height: {this.state.h}px</div>
      </div>
    );
  }
}
```

`<ResizeSensor />` will create hidden elements that will fill up all available container's width and height, and, will listen to the width / height changes of the container. Once the change is detected, `onResize` prop will get triggered.

**Note 1**: the container should either have `position: relative` or `position: absolute` defined on it.

**Note 2**: in the `ResizeSensor` code, we directly require a CSS stylesheet file from JS. So, make sure that your bundler is configured to use *style-loader* or something similar that allows requiring CSS assets. For example, for webpack, you can use [this style-loader](https://github.com/webpack-contrib/style-loader).

## See Demo

To see a little demo, do the following

```
git clone https://github.com/guitarino/resize-sensor--preact.git .
npm install
npm run demo-webpack
```

In another terminal / cmd

```
npm run demo-server
```

This will tell you the URL address where you'll see a little demo. By changing the browser window size, you can confirm that size change gets reported. By clicking the `Toggle another example` button, you can also confirm that element size gets updated even if the size changed while the element was not visible. You can also play around with the code under `demo/src` and it should automatically re-bundle.

You can also verify that server-side rendering will work by running

```
npm run try-ssr
```

Note, when running SSR, requiring CSS stylesheets from your JS will cause errors, but that can be solved by excluding those assets via this [babel plugin](https://www.npmjs.com/package/babel-plugin-transform-require-ignore).

## Support

IE9+, Edge, Safari, Chrome, Firefox

## How it works

It works very efficiently, without dirty checking; instead, it's based on listening to the scroll events. The way it works is as follows:

1. Inside ResizeSensor, there's elements that serve as triggers for expansion and contraction. Expansion and contraction triggers each have a child.

2. For contraction, the child is 2x bigger than container, and the child's scroll position is set to the bottom right corner. When contracted, the bottom right corner position changes, which triggers a scroll event.

3. For expansion, the child is slightly (1px) bigger than container, and, again, the child's scroll position is set to the bottom right corner. This implies that there's actually a scrollbar on the container. When container expands even slightly (by 1px), the scrollbar disappears, which changes the scroll position, which triggers a scroll event.

4. Whenever a scroll event is triggered, the children's sizes are readjusted so that we can start listening again.

5. Also, there's a possibility that an element becomes hidden and then reappears after some time, and it's possible that the container's size have changed over that time. For that case, there's also a kind of a visibility sensor, which triggers an update whenever the element becomes visible. It's based on CSS3 animations: there's actually an animation that does nothing, yet it gets shown every time the element becomes visible, and `animation-start` event listener is added so we can listen to it.

6. On IE9, none of that actually happens, and instead, `onresize` event is directly attached on the resize sensor. The reason for that is because `animation-start` is not supported on IE9, which makes it impossible to listen to visibility.

## Acknowledgements

Kudos to [procurios](https://github.com/procurios/ResizeSensor) and [marcj](https://github.com/marcj/css-element-queries/) for coming up and / or improving on this method.

## License

[MIT](https://github.com/guitarino/resize-sensor--preact/blob/master/LICENSE)