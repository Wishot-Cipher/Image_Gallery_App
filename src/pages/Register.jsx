import React, { useState } from "react";
import { auth, googleAuthProvider, database } from "../firebaseConfig/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../assets/register.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(database, "users", user.uid), {
        email,
        username,
        role: "user",
      });

      toast.success("Registration successful!");

      navigate("/");
    } catch (error) {
      toast.error("An error occurred. Please try again.");

      console.error(error);
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-no-repeat sm:w-full">
      <div className="max-w-4xl w-full mx-auto lg:flex items-center justify-between bg-white p-4 rounded-lg shadow-lg border-slate-400 border-4 border-opacity-30">
        <div className="w-full lg:w-1/2">
          <img src={image} alt="" className="w-full h-auto" />
        </div>
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 ml-0 lg:ml-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md py-4">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800 md:text-[35px]">
              Sign Up
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Comfirm Password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <button
              onClick={signInWithGoogle}
              className="bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up with Google
            </button>
          </div>

          <div className=" text-center text-xs my-2 font-semibold">
            Have an account?
            <Link className=" text-blue-500 underline font-bold" to={"/login"}>
              Sign In
            </Link>
            .
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
