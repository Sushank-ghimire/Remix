import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Register - Remix App" },
    { name: "description", content: "Create a new account on Remix!" },
  ];
};

export default function Register() {
  return (
    <div className="h-screen w-screen font-bold text-4xl flex justify-center items-center text-white">
      <Form
        method="post"
        className="flex flex-col w-full max-w-md h-fit backdrop-blur-md rounded-md text-sm font-normal p-6 shadow-lg text-black"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-4">
          Register
        </h1>

        <label htmlFor="name" className="mb-2 text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="email" className="mb-2 text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="password" className="mb-2 text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="confirmPassword" className="mb-2 text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        <div className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </div>
      </Form>
    </div>
  );
}
