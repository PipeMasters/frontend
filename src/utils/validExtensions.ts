import { FILE_TYPE_MAP, FileType } from "../services/file";

export const VALID_EXTENSIONS = Object.entries(FILE_TYPE_MAP)
  .filter(([ext, type]) => type !== FileType.OTHER)
  .map(([ext]) => `.${ext}`)
  .join(",");
