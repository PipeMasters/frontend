export const calculateFileHash = async (file: File): Promise<string> => {
  if (!window.crypto || !window.crypto.subtle) {
    const simpleHash = `${file.name}-${file.size}-${file.lastModified}`;
    let hash = 0;
    for (let i = 0; i < simpleHash.length; i++) {
      const char = simpleHash.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    throw new Error(`Ошибка при вычислении хеша файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  }
};