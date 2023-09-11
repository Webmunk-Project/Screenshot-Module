/* global locationFilterMatches, html2canvas */

(function () {
  window.registerModuleCallback(function (config) {
    config['screenshot-filters'] = [{
      hostEquals: 'www.cnn.com'
    }]

    config['screenshot-rules'] = [{
      match: '.zn-homepage1-zone-1 article:not(.screenshot-taken)'
    }]

    if (locationFilterMatches(window.location, config['screenshot-filters'])) {
      console.log('[Screenshot] Checking ' + window.location + '.')

      const pageUpdate = function () {
        config['screenshot-rules'].forEach(function (rule) {
          const matches = $(document).find(rule.match)

          console.log('[Screenshot] Rule: ' + rule.match + ': ' + matches.length)

          matches.each(function (index, element) {
            $(element).addClass('screenshot-taken')

            const domElement = element // .get(0)

            const rect = domElement.getBoundingClientRect()

            console.log('[Screenshot] Recording screenshot from ' + window.location + '...')

            const top = rect.top
            const left = rect.left
            const width = rect.width
            const height = rect.height

            console.log('[Screenshot] CAPTURE ' + top + ', ' + left + ', ' + width + ', ' + height)
            console.log(chrome)
            console.log(html2canvas)

            window.setTimeout(function () {
              html2canvas(element, {
                allowTaint: false,
                useCORS: true
              }).then(function (canvas) {
                console.log('[Screenshot] CANVAS')
                console.log(canvas)

                document.body.appendChild(canvas)

                const base64image = canvas.toDataURL('image/png')
                console.log('base64image')
                console.log(base64image)

                canvas.remove()
              })

              /*

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

              */
            }, 2500)
          })
        })
      }

      window.registerModulePageChangeListener(pageUpdate)

      pageUpdate()
    } else {
      console.log('[Screenshot] Skipping ' + window.location + '.')
    }
  })
})(); // eslint-disable-line semi, no-trailing-spaces
