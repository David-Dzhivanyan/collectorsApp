export function useUploadUrl() {
  const base = 'http://localhost:3001'
  return (filename: string) => `${base}/uploads/${filename}`
}
