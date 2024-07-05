if (window._global) {
  window.postMessage(
    { type: 'GET_VALUE', value: window._global, sourceUrl: window.location.origin },
    '*',
  )
}
