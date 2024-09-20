chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.')
})

function syncCookies(sourceUrl, targetUrl) {
  return new Promise((resolve, reject) => {
    const u = new URL(sourceUrl)
    chrome.cookies.getAll({ url: `${u.protocol}//${u.hostname}` }, (cookies) => {
      if (chrome.runtime.lastError) {
        console.log('Error getting cookies:', chrome.runtime.lastError)
        reject(chrome.runtime.lastError)
        return
      }
      if (!cookies) {
        reject({
          message: 'No cookies found in source url.',
        })
        return
      }
      cookies.forEach((cookie) => {
        const cookieDetails = {
          url: targetUrl,
          name: cookie.name,
          value: cookie.value,
          domain: new URL(targetUrl).hostname,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          expirationDate: cookie.expirationDate,
        }
        chrome.cookies.set(cookieDetails, (cookie) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
            console.error('Error setting cookie:', chrome.runtime.lastError)
          } else {
            resolve()
            console.log(`Cookie ${cookie.name} set successfully.`)
          }
        })
      })
    })
  })
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  const handles = {
    SYNC_COOKIES: () => {
      syncCookies(request.sourceUrl, request.targetUrl)
        .then(() => {
          sendResponse({ status: 'success' })
        })
        .catch((err) => {
          sendResponse({ status: 'error', message: err.message })
        })
    },
  }
  handles[request.action]()
  return true
})
