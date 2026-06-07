const store = new Map<string, string>();

export default {
  getItem: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    store.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    store.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    store.clear();
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve([...store.keys()])),
  multiGet: jest.fn((keys: string[]) =>
    Promise.resolve(keys.map((k) => [k, store.get(k) ?? null])),
  ),
  multiSet: jest.fn((pairs: [string, string][]) => {
    pairs.forEach(([k, v]) => store.set(k, v));
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((k) => store.delete(k));
    return Promise.resolve();
  }),
};
