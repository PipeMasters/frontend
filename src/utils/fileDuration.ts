export const getFileDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const tempElement = document.createElement(
      file.type.includes("video") ? "video" : "audio"
    );

    tempElement.src = url;
    tempElement.preload = "metadata";

    tempElement.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.floor(tempElement.duration * 1000));
    };

    tempElement.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось получить длительность файла"));
    };
  });
};
