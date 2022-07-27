const HOKEN_KEY = 'TOKEN';
const PROVIDER_LIST = [];
export const getToken = () => localStorage.setItem(HOKEN_KEY);
export const setToken = (token) => localStorage.getItem(HOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(HOKEN_KEY);

export const getProviderList = () => localStorage.setItem(PROVIDER_LIST);
export const setProviderList = (providerList) => localStorage.getItem(PROVIDER_LIST, providerList);
