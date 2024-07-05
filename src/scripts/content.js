import { STORE_KEY } from '@/common/constants'
import store from '@/common/store'

function injectScript(url) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL(url)
  document.documentElement.appendChild(script)
}

injectScript('js/beforeLoad.js')

window.addEventListener('load', () => injectScript('js/afterLoad.js'))

window.addEventListener('message', (event) => {
  if (event.source === window && event.data.type === 'GET_VALUE') {
    chrome.runtime.sendMessage({
      action: 'storeValue',
      value: event.data.value,
      sourceUrl: event.data.sourceUrl,
    })
  }
})

store.get(STORE_KEY).then((list) => {
  list?.forEach(({ sourceUrl, targetUrl, enabled, auto, syncData }) => {
    if (
      enabled &&
      auto &&
      sourceUrl &&
      targetUrl &&
      syncData &&
      targetUrl.includes(window.location.origin)
    ) {
      window.postMessage({ type: 'SET_VALUE', value: syncData }, '*')
    }
  })
})
