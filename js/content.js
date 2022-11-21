/* global chrome, locationFilterMatches, ImageCapture, createImageBitmap, OffscreenCanvas */

window.registerModuleCallback(function (config) {
  // console.log('[Cookies] Checking host...')
  // console.log(config)

  config['screenshot-filters'] = [{
    hostEquals: 'cnn.com'
  }, {
    hostSuffix: '.cnn.com'
  }]

  config['screenshot-rules'] = [{
    match: 'article'
  }]

  if (locationFilterMatches(window.location, config['screenshot-filters'])) {
    config['screenshot-rules'].forEach(function (rule) {
      const matches = $(document).find(rule.match)

      matches.each(function (index, element) {
        const domElement = element // .get(0)

        const rect = domElement.getBoundingClientRect()

        console.log('[Screenshot] Recording screenshot from ' + window.location + '...')

        const top = rect.top
        const left = rect.left
        const width = rect.width
        const height = rect.height

        console.log('[Screenshot] CAPTURE ' + top + ', ' + left + ', ' + width + ', ' + height)
        console.log(chrome)

        chrome.tabCapture.capture({
          audio: false,
          video: true
        }, function (stream) {
          const track = stream.getVideoTracks()[0]
          const imageCapture = new ImageCapture(track)

          const image = imageCapture.grabFrame()

          image.then(function (bitmap) {
            stream.stop()

            const croppedImage = createImageBitmap(bitmap, left, top, width, height)

            const offscreen = new OffscreenCanvas(width, height)
            const renderer = offscreen.getContext('bitmaprenderer')

            renderer.transferFromImageBitmap(croppedImage)

            const dataUrl = renderer.toDataUrl('image/png')

            console.log('[Screenshot] IMAGE URL: ')
            console.log(dataUrl)

            chrome.runtime.sendMessage({
              content: 'record_screenshot',
              url: window.location.href,
              image: dataUrl,
              top,
              left,
              width,
              height,
              matches: 'todo'
            })
          })
        })
      })
    })
  } else {
    console.log('[Screenshot] Skipping ' + window.location + '.')
  }
})
