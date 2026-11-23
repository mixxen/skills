import { useState } from "react";
import { uploadFile } from "./api";

type Status = "idle" | "uploading" | "done" | "error";

export function FileUpload() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function start(f: File) {
    setFile(f);
    setStatus("uploading");
    setProgress(0);
    try {
      await uploadFile(f, setProgress);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  function cancel() {
    setStatus("idle");
    setProgress(0);
  }

  if (status === "uploading") {
    return (
      <div>
        <progress value={progress} max={100} />
        <button onClick={cancel}>Cancel</button>
      </div>
    );
  }
  if (status === "done") {
    return (
      <div>
        Uploaded!
        <button onClick={() => setStatus("idle")}>Upload another</button>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div role="alert">
        Upload failed: {error}
        <button onClick={() => file && start(file)}>Retry</button>
      </div>
    );
  }
  return <input type="file" onChange={(e) => e.target.files && start(e.target.files[0])} />;
}
