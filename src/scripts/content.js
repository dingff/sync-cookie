import { STORE_KEY } from '@/common/constants'
import store from '@/common/store'

function injectScript(url) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL(url)
  document.documentElement.appendChild(script)
}

injectScript('js/inject.js')

window.addEventListener('message', (event) => {
  if (event.source === window && event.data.type === 'GET_VALUE') {
    store.get(STORE_KEY).then((list) => {
      const next = list?.map((item) => {
        if (event.data.sourceUrl.includes(new URL(item.sourceUrl).origin)) {
          console.log('Get sync data:', event.data.value)
          return {
            ...item,
            syncData: event.data.value,
          }
        }
        return item
      })
      store.set(STORE_KEY, next)
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
