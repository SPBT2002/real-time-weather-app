const cache = {};

const setCache = (key, data, ttlMs) => {
  cache[key] = { data, expiry: Date.now() + ttlMs };
};

const getCache = (key) => {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }
  return item.data;
};

module.exports = { setCache, getCache };
