'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/admin/getissues/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        setProjectData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) return <p className="p-8 text-lg">Loading project details...</p>;
  if (error) return <p className="p-8 text-red-600 font-semibold">Error: {error}</p>;

  const isWrapped = projectData && projectData.issues;
  const issues = isWrapped ? projectData.issues : projectData;

  function handleClick() {
    if (!id) return;
    router.push(`/admin/create-issue?projectId=${id}`);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        {isWrapped ? projectData.name : `Project #${id}`}
      </h1>
      {isWrapped && (
        <p className="text-gray-600 mb-6">{projectData.description}</p>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Issues</h2>
        <button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          + Create Issue
        </button>
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-3">
          {issues.map((issue: any) => (
            <li
              key={issue.id}
              className="border border-gray-300 p-4 rounded shadow-sm"
            >
              <h3 className="font-semibold">{issue.title}</h3>
              <p className="text-sm text-gray-600">Status: {issue.status}</p>
              <p className="text-sm">Assigned to: {issue.assignedTo?.name || 'Unassigned'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues found.</p>
      )}
    </div>
  );
}
