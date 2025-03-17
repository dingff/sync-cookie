window.addEventListener('message', (event) => {
  if (event.source === window && event.data.type === 'SET_VALUE' && !window._global) {
    console.log('_global', event.data.value)
    window._global = event.data.value
  }
})

window.addEventListener('load', () => {
  if (window._global) {
    window.postMessage(
      { type: 'GET_VALUE', value: window._global, sourceUrl: window.location.href },
      '*',
    )
  }
})
