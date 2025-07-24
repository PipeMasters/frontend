import dayjs from "dayjs";
import type { BatchResponse } from "../services/batch";
import type { TrainResponse } from "../services/train";
export const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\-_]/g, "_");
};
export const transliterate = (str: string): string => {
  const ru: { [key: string]: string } = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "j",
    з: "z",
    и: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ы: "y",
    э: "e",
    ю: "yu",
    я: "ya",
    ъ: "",
    ь: "",
  };
  return str
    .toLowerCase()
    .replace(
      /[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g,
      (char) => ru[char] || char
    );
};
export const generateUniqueFilename = (
  originalName: string,
  batch: BatchResponse | undefined,
  train: TrainResponse | undefined
): string => {
  if (!batch) return originalName;

  const ext = originalName.split(".").pop()?.toLowerCase() || "";
  const nameWithoutExt =
    originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

  const transliteratedName = transliterate(nameWithoutExt);
  const sanitizedName = sanitizeFilename(transliteratedName);

  const creationDate = dayjs(batch.createdAt).format("DD-MM-YYYY");

  const randomId = Math.random().toString(36).substring(2, 8);
  const newFilename = `${sanitizedName}_${batch.id}_${train?.trainNumber}_${creationDate}_${randomId}.${ext}`;

  return newFilename;
};
