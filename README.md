## clockface.js

Canvas-based clock face input for time of day.
*Modern browsers ONLY*, as canvas and the selectors API are used.

## quick start

```js
var clockInput = new clockface.ClockFaceInput({
  el: '#clock-test',
  onClockChange: function(clockTime) {
    console.log(clockTime.secondsSinceMidnight)
    console.log(clockTime.hours)
    console.log(clockTime.minutes)
    console.log(clockTime.seconds)
    }
  },
  snap: 60 * 5
})
```

## example
An [example](http://ingar.github.io/clockface/) of using the library as a standalone clock face renderer, and as an input.
