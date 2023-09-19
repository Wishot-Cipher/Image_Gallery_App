import React, { useState } from 'react';
import { auth, googleAuthProvider } from '../../firebaseConfig/config';
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user] = useAuthState(auth);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setEmail('');
      setPassword('');
      toast.success('Login successful!');
      navigate("/")
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate("/")
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      toast.success('Login successful!');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center sm:px-6 lg:px-8 md:mx-0 bg-[url(/src/assets/loginBackground.jpg)] bg-cover bg-no-repeat ${user ? ' bg-gray-200' : ' bg-gray-100'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-lg mx-2 border-[#86aaf9] border-4 border-opacity-30 shadow-2xl bg-white rounded-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md py-4">
          <h2 className="mt-4 text-center text-[30px] md:text-[35px] font-extrabold text-slate-800 text-3xl">Log In</h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!user && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    user ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                  disabled={user}
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {!user && (
            <div className="text-center mt-4">
              <button
                onClick={signInWithGoogle}
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  user
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
                disabled={user}
              >
                Log In with Google
              </button>
            </div>
          )}

          {user && (
            <button onClick={handleLogOut} className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700">
              Log out
            </button>
          )}

          {!user && (
            <div className="text-center text-xs my-2 font-semibold">
              Don't have an account?{' '}
              <Link className="text-blue-500 underline font-bold" to="/register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// export default LoginForm;
