import { useState } from "react";
import { Form, Button, Card, Upload, Progress, notification } from "antd";
import { useUploadFile } from "../features/file/useUploadFile";
import { FileType, FILE_TYPE_MAP } from "../services/file/model";
import { getFileDuration } from "../utils/fileDuration";
import { calculateFileHash } from "../utils/fileHash";
import { VALID_EXTENSIONS } from "../utils/validExtensions";
import { useQueryClient } from "@tanstack/react-query";
import { useGetBatch } from "../features/batch";
import { useGetTrain } from "../features/train";
import { generateUniqueFilename } from "../utils/filenameUtils";

export default function UploadFileForm({ fileId }: { fileId: number }) {
  const [form] = Form.useForm();
  const { uploadFileAsync, isPending } = useUploadFile(fileId);
  const { data: batch, isLoading: isBatchLoading } = useGetBatch(fileId);
  const trainId = batch?.trainId;
  const trainQuery = useGetTrain(trainId ?? 1);
  const train = trainQuery.data;
  const queryClient = useQueryClient();
  const MAX_FILES = 5;
  const [files, setFiles] = useState<File[]>([]);
  const [activeUploads, setActiveUploads] = useState<number>(0);

  const onFinish = async () => {
    if (!files.length) {
      notification.error({ message: "Ошибка", description: "Выберите файлы" });
      return;
    }
    if (files.length > MAX_FILES) {
      notification.warning({
        message: "Много файлов",
        description: `Можно загружать не более ${MAX_FILES} файлов за раз.`,
      });
      return;
    }
    if (isBatchLoading) {
      notification.warning({
        message: "Предупреждение",
        description: "Данные батча еще загружаются, попробуйте позже.",
      });
      return;
    }
    if (!batch) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить данные батча",
      });
      return;
    }

    setActiveUploads(files.length);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const originalName = file.name;
        const ext = originalName.split(".").pop()?.toLowerCase() || "";
        const guessedType =
          ext in FILE_TYPE_MAP ? FILE_TYPE_MAP[ext] : FileType.OTHER;

        if (guessedType === FileType.OTHER) {
          notification.error({
            key: `invalid-${originalName}`,
            message: `Неподдерживаемый тип файла`,
            description: `Файл "${originalName}" имеет неподдерживаемое расширение.`,
            duration: 3,
          });
          continue;
        }

        const filename = generateUniqueFilename(originalName, batch, train);

        const key = `upload-${originalName}-${Math.random().toString(36).substring(7)}`;
        notification.info({
          key,
          message: `Загрузка: ${originalName}`,
          description: <Progress percent={0} />,
          duration: 0,
        });

        try {
          const hash = await calculateFileHash(file);
          let duration: number | undefined;
          if (
            guessedType === FileType.VIDEO ||
            guessedType === FileType.AUDIO
          ) {
            try {
              duration = await getFileDuration(file);
            } catch (err) {
              console.warn(`Не удалось получить длительность для ${file.name}`);
            }
          }
          await uploadFileAsync({
            fileData: {
              filename,
              fileType: guessedType,
              uploadBatchId: fileId,
              size: file.size,
              duration,
              hash,
            },
            file,
            onProgress: (progress) => setProgress(key, progress),
          });
          notification.success({
            key,
            message: `Файл ${originalName} загружен`,
            description: `Имя файла: ${filename}`,
            duration: 3,
          });
        } catch (error: any) {
          const status = error?.response?.status;
          if (status === 409) {
            notification.warning({
              key,
              message: `Файл "${filename}" уже существует`,
              description: `Файл "${originalName}" не загружен, так как файл с таким именем уже существует.`,
              duration: 5,
            });
          } else {
            notification.error({
              key,
              message: `Ошибка: ${originalName}`,
              description:
                error.message || "Произошла ошибка при загрузке файла",
              duration: 3,
            });
          }
        }
      }
      notification.success({ message: "Загрузка файлов завершена" });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["batch", fileId] });
        queryClient.invalidateQueries({ queryKey: ["files"] });
      }, 4000);
    } catch (error) {
      notification.error({ message: "Произошла ошибка при загрузке файлов" });
    } finally {
      form.resetFields();
      setFiles([]);
      setActiveUploads(0);
    }
  };

  const setProgress = (
    key: string,
    percent: number,
    success: boolean = false
  ) => {
    notification.info({
      key,
      message: `Загрузка: ${key.split("-")[1]}`,
      description: (
        <Progress percent={percent} status={success ? "success" : undefined} />
      ),
      duration: 0,
    });
  };

  const beforeUpload = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const guessedType =
      ext in FILE_TYPE_MAP ? FILE_TYPE_MAP[ext] : FileType.OTHER;
    if (guessedType === FileType.OTHER) {
      notification.error({
        message: "Ошибка",
        description: `Файлы с расширением .${ext} нельзя загружать`,
        duration: 3,
      });
      return false;
    }
    setFiles((prev) => [...prev, file]);
    return false;
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card title="Загрузить файл" className="max-w-md">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Выберите файлы (до 5)">
          <div className="flex flex-col gap-2 mb-4">
            <Upload
              multiple
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept={VALID_EXTENSIONS}
            >
              <Button>Выбрать файлы</Button>
            </Upload>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded w-full"
              >
                <span className="text-sm text-gray-600 truncate">
                  {file.name}
                </span>
                <Button danger size="small" onClick={() => removeFile(index)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            disabled={isPending || activeUploads > 0 || isBatchLoading}
            loading={isPending || activeUploads > 0 || isBatchLoading}
            className="!bg-red-600 !text-white !border-none w-full"
          >
            {isBatchLoading
              ? "Загрузка данных батча..."
              : isPending || activeUploads > 0
                ? `${activeUploads} файлов в очереди...`
                : "Загрузить файлы"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
