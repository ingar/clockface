(function() {

  function SBBCanvasRenderer(opts) {
    var el = opts.el
    var radius = opts.radius || 100
    var diameter = radius * 2

    var canvas = document.createElement('canvas')
    canvas.setAttribute('style', [
      'box-shadow: 0 0 20px rgba(0,0,0,0.75);',
      'padding: 10px;'
    ].join(''))
    el.appendChild(canvas)
    var ctx = canvas.getContext('2d')

    var renderHourHand = function(seconds) {
      var modulus = 12 * 3600
      var theta = (2 * Math.PI * (seconds % modulus) / modulus)
      renderHand(radius * 0.5, radius * 0.1, theta, 'black')
    }

    var renderMinuteHand = function(seconds) {
      var modulus = 3600
      var theta = (2 * Math.PI * (seconds % modulus) / modulus)
      renderHand(radius * 0.95, radius * 0.075, theta, 'black')
    }

    var renderSecondHand = function(seconds) {
      var theta = (2 * Math.PI * (seconds % 60) / 60)
      renderHand(radius * 0.7, radius * 0.05, theta, 'red')
    }

    var renderMarks = function() {
      for (var i = 0; i < 12; i++) {
        ctx.save()
          ctx.translate(radius, radius)
          ctx.rotate(2*Math.PI * (i / 12))
          ctx.strokeStyle = 'black'
          ctx.lineWidth = radius * 0.1
          ctx.beginPath()
          ctx.moveTo(0, radius * 0.75)
          ctx.lineTo(0, radius)
          ctx.stroke()
        ctx.restore()
      }
    }

    var renderHand = function(length, width, theta, color) {
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
      renderHourHand(seconds)
      renderMinuteHand(seconds)
      renderSecondHand(seconds)
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

    function _setTime(t) {
      var unixTime = t.getTime() * 0.001
      var localSeconds = unixTime - (t.getTimezoneOffset() * 60)
      renderer.render(localSeconds)
    }

    _setTime(new Date())

    return {
      setTime: _setTime
    }
  }

  window.ClockFace = ClockFace
  window.SBBCanvasRenderer = SBBCanvasRenderer

})()
