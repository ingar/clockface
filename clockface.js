// clockface.js 0.0.1
// (c) 2013 Ingar Shu
// https://github.com/ingar/clockface.js
// Released under the MIT license.

(function() {

  function SBBCanvasRenderer(opts) {
    var container = document.querySelector(opts.el)
    var radius = opts.radius || 100
    var diameter = radius * 2

    var canvas = document.createElement('canvas')
    container.appendChild(canvas)
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
      if (opts.secondHand) {
        renderHand(radius * 0.7, radius * 0.05, handAngle(seconds, 60), 'red')
      }
    }

    function _setTime(hours, minutes, seconds) {
      hours = hours || 0
      minutes = minutes || 0
      seconds = seconds || 0
      _render(hours * 3600 + minutes * 60 + seconds)
    }

    _render(0)

    return {
      el: canvas,
      setTime: _setTime
    }
  }

  function ClockFaceInput(opts) {
    var renderer = opts.renderer || new SBBCanvasRenderer(opts)
    var el = renderer.el

    el.setAttribute('style', [
      'cursor: pointer;',
      '-webkit-user-select: none;'
    ].join(''))

    var onClockChange = opts.onClockChange
    var settingHandPosition = false
    var clockTime = {
      secondsSinceMidnight: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    function setClock(ssm) {
      if (opts.snap) {
        ssm = (Math.floor((ssm / opts.snap) + 0.5) * opts.snap) % (12 * 3600)
      }

      if (clockTime.secondsSinceMidnight != ssm) {
        clockTime.secondsSinceMidnight = ssm
        clockTime.seconds = ssm % 60
        clockTime.minutes = ((ssm - clockTime.seconds) / 60) % 60
        clockTime.hours = (ssm - clockTime.minutes * 60 - clockTime.seconds) / 3600
        renderer.setTime(clockTime.hours, clockTime.minutes, clockTime.seconds)
        if (onClockChange) {
          onClockChange(clockTime)
        }
      }
    }

    function moveHourHand(offsetX, offsetY) {
      var mid = [el.clientWidth / 2, el.clientHeight / 2]
      var hourAngle = Math.atan2(offsetY - mid[1], offsetX - mid[0]) + Math.PI / 2

      if (hourAngle < 0) {
        hourAngle += 2 * Math.PI
      }
      var secondsSinceMidnight = Math.round((hourAngle / (2 * Math.PI)) * 12 * 3600)
      setClock(secondsSinceMidnight)
    }

    function listen(eventName, fn) {
      el.addEventListener(eventName, fn, false)
    }

    listen('mousedown', function(e) {
      settingHandPosition = true
      moveHourHand(e.offsetX, e.offsetY)
      e.preventDefault()
    })

    listen('mousemove', function(e) {
      if (settingHandPosition) {
        moveHourHand(e.offsetX, e.offsetY)
        e.preventDefault()
      }
    })

    listen('mouseup', function(e) {
      settingHandPosition = false
    })

    listen('mouseout', function(e) {
      settingHandPosition = false
    })

    function zeroPad(i) {
      return i < 10 ? ('0' + i) : i.toString()
    }

    function _toString() {
      return zeroPad(clockTime.hours) + ':' + zeroPad(clockTime.minutes) + ':' + zeroPad(clockTime.seconds)
    }

    return {
      toString: _toString,
      time: clockTime
    }
  }

  window.clockface = {
    SBBCanvasRenderer: SBBCanvasRenderer,
    ClockFaceInput: ClockFaceInput
  }

})()
