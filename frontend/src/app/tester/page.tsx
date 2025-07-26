"use client";
import { useEffect, useState } from "react";

type Issue = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  project: {
    projectName: string;
  };
};

const Tester = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/tester/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Error fetching issues:", res.status, text);
          return;
        }

        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchIssues();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/tester/changestatus/${id}?status=${newStatus}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to update status:", res.status, errorText);
      return;
    }

    // Update local state after success
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus as Issue["status"] } : issue
      )
    );

    console.log("Status updated successfully");
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="font-bold text-2xl">Welcome Tester</h1>

      {issues.map((issue) => (
        <div
          key={issue.id}
          className="flex justify-between border border-black p-4 bg-gray-100"
        >
          <div className="flex flex-col">
            <h1>Task Name: {issue.title}</h1>
            <h1>Task Priority: {issue.priority}</h1>
            <h1>Project Name: {issue.project?.projectName}</h1>
          </div>
          <div className="flex items-center">
            <label className="mr-2 font-semibold">Status:</label>
            <select
              value={issue.status}
              className="border border-gray-400 p-1 rounded"
              onChange={(e) => handleStatusChange(issue.id, e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tester;
