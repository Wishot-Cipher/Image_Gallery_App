// src/pages/Login.js
import React from 'react';
import {LoginForm} from '../components/Authentication/LoginForm';

const Login = () => {
  return (
    <div className="lg:container mx-auto p-6">
      {/* <h1 className="text-2xl font-semibold mb-4">Login</h1> */}
      <LoginForm />
    </div>
  );
};

export default Login;
