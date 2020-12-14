import { createRef } from 'react';
export default () => {
  const ref = createRef();
  return new Proxy(ref, {
    get(target, key) {
      if (key === 'current' && target.current) {
        const currentProxy = new Proxy(target.current, {
          get(current, currentKey) {
            let res = current[currentKey];
            if (!res && current._store) {
              res = current._store[currentKey];
            }
            return res;
          },
        });
        return currentProxy;
      }
      if (!target[key] && target.current) {
        let res = target.current[key];
        if (!res && target.current._store) {
          res = target.current._store[key];
        }
        return res;
      }
      return target[key];
    },
  });
};
