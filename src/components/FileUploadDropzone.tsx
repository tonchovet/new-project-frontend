// src/components/FileUploadDropzone.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DropzoneArea } from 'react-dropzone';

export function FileUploadDropzone({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (!session?.accessToken) return;
    const form = new FormData();
    form.append('file', acceptedFiles[0]);
    form.append('projectId', projectId);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: form,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const data = await res.json();
      setFiles((prev) => [...prev, data]); // data contains id, name, etc.
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-dashed border-2 rounded p-4">
      <DropzoneArea
        onChange={handleDrop}
        acceptedFiles={['image/*', 'application/pdf', 'text/*']}
        maxFileSize={10 * 1024 * 1024}
      />
      {uploading && <p>Uploading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {files.map((f) => (
          <li key={f.id} className="flex justify-between">
            <span>{f.originalName}</span>
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files/${f.id}`}
              className="text-blue-600"
              download
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
