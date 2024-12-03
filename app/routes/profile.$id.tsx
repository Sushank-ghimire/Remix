import { MetaFunction, redirect } from "@remix-run/node";
import User from "../../database/users";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "User's Profile" },
    { name: "description", content: "View and manage your profile" },
  ];
};

export const loader = async ({ params }: { params: { id: number } }) => {
  const user = await User.getUserById(params.id);
  if (!user) {
    return redirect("/");
  }
  return new Response(JSON.stringify(user), {
    headers: {
      "Content-type": "application/json",
    },
  });
};

export default function Index() {
  const userData = useLoaderData<{
    name: string;
    email: string;
  }>();

  const handleLogout = () => {
    localStorage.removeItem("user");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (!user) {
      navigate("/login");
    }
  }, [handleLogout, userData]);
  return (
    <main className="relative h-screen text-white w-screen">
      <nav className="absolute left-0 w-screen top-0 py-4 px-3 md:px-6 flex justify-between items-center">
        <h1>{userData?.name}</h1>
        <p>{userData.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-2 rounded-md transition-all hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
      <div className="h-full w-full flex-col flex justify-center items-center pt-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
          Welcome {userData.name}
        </h1>
        <p className="text-base md:text-lg text-gray-200 max-w-lg text-center">
          Manage your account, update details, and more.
        </p>
      </div>
    </main>
  );
}
