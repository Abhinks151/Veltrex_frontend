import { useState } from 'react';

export default function Program() {
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null,
  );

  const openFile = async () => {
    const [handle] = await (window as unknown as Window).showOpenFilePicker({
      types: [
        {
          description: 'NC Files',
          accept: {
            'text/plain': ['.nc', '.tap', '.gcode', '.txt'],
          },
        },
      ],
    });

    const file = await handle.getFile();
    const text = await file.text();

    setFileHandle(handle);
    setContent(text);
  };

  const saveFile = async () => {
    if (!fileHandle) return;

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    setEditing(false);
    alert('File saved successfully.');
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={openFile}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Open File
      </button>

      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] rounded border p-4 font-mono"
        />
      ) : (
        <pre className="rounded bg-gray-100 p-4 overflow-auto">{content}</pre>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setEditing((v) => !v)}
          className="rounded bg-yellow-500 px-4 py-2 text-white"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>

        {editing && (
          <button
            onClick={saveFile}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

interface Window {
  showOpenFilePicker(options?: {
    types?: {
      description?: string;
      accept: Record<string, string[]>;
    }[];
    multiple?: boolean;
  }): Promise<FileSystemFileHandle[]>;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | Blob): Promise<void>;
  close(): Promise<void>;
}
