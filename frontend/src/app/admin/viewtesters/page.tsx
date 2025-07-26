"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

const ViewTesters = () => {
  const [tester, setTester] = useState<User[]>([]);

  useEffect(() => {
  const fetchTesters = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/admin/testers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text(); // get plain text
        console.error("Error fetching testers:", res.status, text);
        return;
      }

      const data = await res.json(); // only parse JSON if .ok is true
      setTester(data);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  fetchTesters();
}, []);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Testers</h2>
      <ul className="space-y-4">
        {tester.map((t) => (
          <li
            key={t.id}
            className="border p-4 rounded shadow-md bg-white text-gray-800"
          >
            <p><strong>Name:</strong> {t.name}</p>
            <p><strong>Email:</strong> {t.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTesters;
