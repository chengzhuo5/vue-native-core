import { createRef } from 'react'
export default () => {
  const ref = createRef()
  return new Proxy(ref, {
    get(target, key) {
      if (key === 'current' && target.current) {
        const currentProxy = new Proxy(target.current, {
          get(current, currentKey) {
            return current[currentKey] || current._store[currentKey]
          },
        })
        return currentProxy
      }
      if (!target[key] && target.current) {
        return target.current[key] || target.current._store[key]
      }
      return target[key]
    },
  })
}