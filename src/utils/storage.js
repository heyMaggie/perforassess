const HOKEN_KEY = 'TOKEN';
const ProviderList = [];
export const getToken = () => localStorage.setItem(HOKEN_KEY);
export const setToken = (token) => localStorage.getItem(HOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(HOKEN_KEY);

export const getProviderList = () => localStorage.setItem(ProviderList);
export const setProviderList = (providerList) => localStorage.getItem(ProviderList, providerList);
