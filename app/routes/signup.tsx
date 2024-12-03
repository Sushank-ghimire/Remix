import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import connection from "database/dbConnect";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Register - Remix App" },
    { name: "description", content: "Create a new account on Remix!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const userData = {
      email: formData.get("email") as string | null,
      password: formData.get("password") as string | null,
      name: formData.get("name") as string | null,
    };

    const { email, password, name } = userData;

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Perform database operation
    const [result]: any = await connection.query(
      "INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    if (result.insertId) {
      return new Response(
        JSON.stringify({ message: "Account created successfully." }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle unexpected result
    return new Response(
      JSON.stringify({ error: "Failed to create account. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle server-side errors
    console.error("Error creating account:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function Register() {
  const actionData = useActionData<{
    error?: string;
    message?: string;
  }>();

  // Ref to the form element
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to reset the form when an account is successfully created
  useEffect(() => {
    if (actionData?.message && formRef.current) {
      formRef.current.reset(); // Clear the form fields
    }
  }, [actionData]);
  return (
    <div className="h-screen w-screen font-bold text-4xl flex flex-col justify-center items-center text-white">
      <Form
        ref={formRef}
        method="post"
        className="flex flex-col w-full max-w-md h-fit backdrop-blur-md rounded-md text-sm font-normal p-6 shadow-lg text-black"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-4">
          Register
        </h1>{" "}
        {actionData?.error && (
          <div className="font-medium text-center text-sm mb-2 text-red-500">
            {actionData.error}
          </div>
        )}
        {actionData?.message && (
          <div className="font-medium text-center text-sm mb-2 text-green-500">
            {actionData.message}
          </div>
        )}
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
