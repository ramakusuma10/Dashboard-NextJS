export const login = (username: string, password: string) => {
    if (username === 'ramakusuma' && password === 'kaede') {
      localStorage.setItem('authToken', 'authenticated');
      return true;
    }
    return false;
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken');
  };
  
  export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };