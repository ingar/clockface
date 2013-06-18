Canvas-based clock face input for time of day.

## Quick Start

```js
var clockInput = new clockface.ClockFaceInput({
  el: '#clock-test',
  onClockChange: function(clockTime) {
    console.log(clockTime.secondsSinceMidnight)   // (AM only)
    console.log(clockTime.hours)
    console.log(clockTime.minutes)
    console.log(clockTime.seconds)
    }
  },
  snap: 60 * 5  // snap to this interval of seconds
})
```