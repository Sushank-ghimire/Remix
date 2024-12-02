import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import connection from "database/dbConnect";

export const meta: MetaFunction = () => {
  return [
    { title: "Hello Remix" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen w-screen font-bold text-4xl flex justify-center items-center text-white">
      <h1>Hello remix</h1>
    </div>
  );
}
