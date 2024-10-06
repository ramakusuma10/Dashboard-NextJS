export const login = (username: string, password: string) => {
    if (username === 'user' && password === '1234') {
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
