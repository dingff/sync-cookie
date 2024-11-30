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
        if (
          item.sourceUrl &&
          new URL(event.data.sourceUrl).hostname === new URL(item.sourceUrl).hostname
        ) {
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
  list?.forEach(({ targetUrl, enabled, syncData, sourceUrl }) => {
    // 目标地址需要区分端口
    if (enabled && sourceUrl && targetUrl && window.location.origin === new URL(targetUrl).origin) {
      chrome.runtime.sendMessage({ action: 'SYNC_COOKIES', sourceUrl, targetUrl })
      window.postMessage({ type: 'SET_VALUE', value: syncData }, '*')
      setTimeout(() => {
        window.postMessage({ type: 'SET_VALUE', value: syncData }, '*')
      }, 100)
    }
  })
})
