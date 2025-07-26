"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

type Tester = { id: number; name: string };
type Priority = "LOW" | "MEDIUM" | "HIGH";

export default function CreateIssueForm() {
  const searchParams = useSearchParams();
  const projectIdFromURL = searchParams.get("projectId");

  const [projectId, setProjectId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [testerId, setTesterId] = useState<number | null>(null);
  const [testers, setTesters] = useState<Tester[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Set project ID from URL
    if (projectIdFromURL) {
      setProjectId(Number(projectIdFromURL));
    } else {
      setError("Project ID not provided in URL.");
    }
  }, [projectIdFromURL]);

  useEffect(() => {
    const fetchTesters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/admin/testers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTesters(res.data);
      } catch (err) {
        setError("Failed to fetch testers");
      }
    };
    fetchTesters();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/admin/createissue",
        {
          title,
          description,
          priority,
          testerId,
          projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Issue created successfully!");
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setTesterId(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error creating issue");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Issue</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Priority</label>
          <select
            className="w-full border p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Assign Tester</label>
          <select
            className="w-full border p-2 rounded"
            value={testerId || ""}
            onChange={(e) => setTesterId(Number(e.target.value))}
            required
          >
            <option value="">Select a Tester</option>
            {testers.map((tester) => (
              <option key={tester.id} value={tester.id}>
                {tester.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Issue
        </button>
      </form>
    </div>
  );
}
