(function() {

  function SBBCanvasRenderer(opts) {
    var el = opts.el
    var radius = opts.radius || 100
    var diameter = radius * 2

    var canvas = document.createElement('canvas')
    canvas.setAttribute('style', [
      'box-shadow: 0 0 20px rgba(0,0,0,0.75);',
      'padding: 10px;',
      'cursor: pointer;',
      '-webkit-user-select: none;'
    ].join(''))
    el.appendChild(canvas)
    var ctx = canvas.getContext('2d')

    function handAngle(seconds, modulus) {
      return 2 * Math.PI * (seconds % modulus) / modulus
    }

    function renderMarks() {
      for (var i = 0; i < 12; i++) {
        ctx.save()
          ctx.strokeStyle = 'black'
          ctx.lineWidth = radius * 0.1
          ctx.translate(radius, radius)
          ctx.save()
            ctx.rotate(2*Math.PI * (i / 12))
            ctx.beginPath()
            ctx.moveTo(0, radius * 0.75)
            ctx.lineTo(0, radius)
            ctx.stroke()
          ctx.restore()
        ctx.restore()
      }
    }

    function renderHand(length, width, theta, color) {
      ctx.save()
        ctx.translate(radius, radius)
        ctx.rotate(theta)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(0, radius * 0.2)
        ctx.lineTo(0, -length)
        ctx.stroke()
      ctx.restore()
    }

    function _render(seconds) {
      canvas.width = diameter
      canvas.height = diameter
      renderMarks()
      renderHand(radius * 0.5, radius * 0.1, handAngle(seconds, 12*3600), 'black')
      renderHand(radius * 0.95, radius * 0.075, handAngle(seconds, 3600), 'black')
//      renderHand(radius * 0.7, radius * 0.05, handAngle(seconds, 60), 'red')
    }

    return {
      render: _render
    }
  }


  function ClockFace(opts) {
    var renderer = opts.renderer || new SBBCanvasRenderer({
      el: opts.el,
      radius: opts.radius
    })

    var el = opts.el
    el.setAttribute('style', 'display:inline-block;')

    function _setSecondsSinceMidnight(seconds) {
      renderer.render(seconds)
    }

    function _setTime(t) {
      var unixTime = t.getTime() * 0.001
      var localSeconds = unixTime - (t.getTimezoneOffset() * 60)
      _setSecondsSinceMidnight(localSeconds)
    }

    _setTime(new Date())

    return {
      setTime: _setTime,
      setSeconds: _setSecondsSinceMidnight
    }
  }


  function ClockFaceInput(opts) {
    var self = this
    var el = opts.el
    var clockFace = new ClockFace(opts)
    var onClockChange = opts.onClockChange
    var settingHandPosition = false
    this.value = -1

    function setClock(ssm) {
      if (opts.snap) {
        ssm = (Math.floor((ssm / opts.snap) + 0.5) * opts.snap) % (12 * 3600)
      }

      if (self.value != ssm) {
        self.value = ssm
        clockFace.setSeconds(ssm)
        if (onClockChange) {
          onClockChange(ssm)
        }
      }
    }

    function moveHourHand(x, y) {
      var mid = [el.clientWidth / 2, el.clientHeight / 2]
      var hourAngle = Math.atan2(y - mid[1], x - mid[0]) + Math.PI / 2

      if (hourAngle < 0) {
        hourAngle += 2 * Math.PI
      }
      var secondsSinceMidninght = Math.round((hourAngle / (2 * Math.PI)) * 12 * 3600)
      setClock(secondsSinceMidninght)
    }

    function listen(eventName, fn) {
      el.addEventListener(eventName, fn, false)
    }

    listen('mousedown', function(e) {
      settingHandPosition = true
      moveHourHand(e.offsetX, e.offsetY)
    })

    listen('mousemove', function(e) {
      if (settingHandPosition) {
        moveHourHand(e.offsetX, e.offsetY)
      }
    })

    listen('mouseup', function(e) {
      settingHandPosition = false
    })

    listen('mouseout', function(e) {
      settingHandPosition = false
    })

    function zeroPad(i) {
      return i < 2 ? ('0' + i) : i.toString()
    }

    function _toString() {
      var date = new Date(Date.parse('Jan 1, 1970') + self.value * 1000)
      return zeroPad(date.getHours()) + ':' + zeroPad(date.getMinutes()) + ':' + zeroPad(date.getSeconds())
    }

    return {
      toString: _toString
    }
  }

  window.SBBCanvasRenderer = SBBCanvasRenderer
  window.ClockFace = ClockFace
  window.ClockFaceInput = ClockFaceInput

})()
