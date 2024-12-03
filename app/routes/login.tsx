import { type MetaFunction, json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import connection from "database/dbConnect";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Remix App" },
    { name: "description", content: "Create a new account on Remix!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  const [result]: any = await connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  const user = result[0];

  if (user) {
    const isPasswordValid = user.password === password;

    if (isPasswordValid) {
      // Add proper session or token management here
      return json(
        {
          message: "Login successful",
          user: { id: user.id, email: user.email, name: user.name },
        },
        { status: 200 }
      );
    } else {
      return json({ error: "Invalid password" }, { status: 401 });
    }
  } else {
    return json({ error: "User is not registered." }, { status: 404 });
  }
};

export default function Index() {
  const actionData = useActionData<{
    error?: string;
    message?: string;
    user?: { id: number; email: string; name: string };
  }>();

  const formRef = useRef<null | HTMLFormElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.message && actionData.user) {
      formRef.current?.reset();
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: actionData.user.email,
          name: actionData.user.name,
          id: actionData.user.id,
        })
      );
      navigate(`/profile/${actionData.user.id}`);
    }
  }, [actionData]);

  return (
    <div className="h-screen w-screen font-bold text-4xl flex justify-center items-center text-white">
      <Form
        ref={formRef}
        method="post"
        className="flex flex-col w-full max-w-md h-fit backdrop-blur-md rounded-md text-sm font-normal p-6 shadow-lg text-black"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-4">
          Login
        </h1>

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
