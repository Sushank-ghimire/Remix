import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import connection from "database/dbConnect";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Remix App" },
    { name: "description", content: "Create a new account on Remix!" },
  ];
};

export const action = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const formData = await request.formData();

  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!userData.email || !userData.password) {
    return Response.json({ error: "Email or password is required" });
  }

  const result = await connection.query("SELECT * FROM users WHERE email = ?", [
    userData.email,
  ]);

  const user = result[0];

  if (result.length > 0) {
    if (userData.password === user?.password) {
      console.log("User logged in successfully.");
    } else {
      return Response.json({ error: "Invalid password" });
    }
  } else {
    return Response.json({ error: "User is not registered." }, { status: 400 });
  }
  return Response.json({
    success: true,
    message: "User logged in successfully.",
  });
};

export default function Index() {
  return (
    <div className="h-screen w-screen font-bold text-4xl flex justify-center items-center text-white">
      <Form
        method="post"
        className="flex flex-col w-full max-w-md h-fit backdrop-blur-md rounded-md text-sm font-normal p-6 shadow-lg text-black"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-4">
          Login
        </h1>

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

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Log In
        </button>

        <div className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </Form>
    </div>
  );
}
