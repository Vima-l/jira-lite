"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function viewproject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/admin/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError('Server error');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Projects</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/admin/slug/${project.id}`)}
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
