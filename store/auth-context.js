import { createContext, useState, useEffect } from 'react';

import axios from '../helpers/axios-orders';

const AuthContext = createContext({
  token: null,
  user: null,
  loading: null,
  error: null,
  signupSuccess: null,
  authenticating: null,
  login: (email, password) => {},
  signup: (email, password, confirmPassword) => {},
  logout: () => {},
  forgetPassword: () => {},
  clearSignupSuccess: () => {},
  updateUserInfo: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('loginToken'))
      setToken(JSON.parse(localStorage.getItem('loginToken')));

    if (localStorage.getItem('userInfo'))
      setUser(JSON.parse(localStorage.getItem('userInfo')));

    setAuthenticating(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/users/login', {
        email,
        password,
      });

      setToken(data.token);
      setUser(data.data.user);
      localStorage.setItem('userInfo', JSON.stringify(data.data.user));
      localStorage.setItem('loginToken', JSON.stringify(data.token));
      setLoading(false);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  const signup = async (name, email, password, passwordConfirm) => {
    setSignupSuccess(false);
    setLoading(true);
    try {
      await axios.post('/api/v1/users/signup', {
        name,
        email,
        password,
        passwordConfirm,
      });
      setLoading(false);
      setSignupSuccess(true);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  const updateUserInfo = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setLoading(null);
    setError(null);

    localStorage.setItem('userInfo', null);
    localStorage.setItem('loginToken', null);
  };

  // const forgetPassword = () => {};

  const clearError = () => {
    setError(null);
  };

  const clearSignupSuccess = () => {
    setError(false);
  };

  const context = {
    token,
    user,
    login,
    loading,
    error,
    signup,
    logout,
    signupSuccess,
    clearError,
    clearSignupSuccess,
    updateUserInfo,
    authenticating,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
