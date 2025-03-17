export const debounce = (fn: any, delay = 200) => {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export const isObject = (v: any) => {
  return Object.prototype.toString.call(v) === '[object Object]'
}
export const uuid = (length: number) => {
  const generateId = () => Date.now().toString(36)
  const ids = Array.from({ length }, generateId)
  return ids.join('').slice(0, length)
}
