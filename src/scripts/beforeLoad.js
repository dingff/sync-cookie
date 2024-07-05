window.addEventListener('message', (event) => {
  if (event.source === window && event.data.type === 'SET_VALUE') {
    console.log('_global', event.data.value)
    window._global = event.data.value
  }
})
