export async function uploadFile(file: File, onProgress: (pct: number) => void): Promise<void> {
  const body = new FormData();
  body.append("file", file);
  const xhr = new XMLHttpRequest();
  await new Promise<void>((resolve, reject) => {
    xhr.upload.onprogress = (e) => onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 400 ? resolve() : reject(new Error(xhr.statusText)));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("POST", "/api/uploads");
    xhr.send(body);
  });
}
