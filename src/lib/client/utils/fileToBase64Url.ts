export function fileToBase64Url(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("failed to convert file to base64"));
    reader.readAsDataURL(file);
  });
}
