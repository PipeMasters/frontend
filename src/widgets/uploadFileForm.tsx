import { useState } from "react";
import { Form, Input, Button, Card, Upload, Progress } from "antd";
import { useUploadFile } from "../features/file/useUploadFile";
import { FileType, FILE_TYPE_MAP } from "../services/file/model";
import { notification } from "antd";
import { uploadFile, uploadToPresignedUrl } from "../services/file";

export default function UploadFileForm() {
  const [form] = Form.useForm();
  const { isPending } = useUploadFile();

  const MAX_FILES = 5;

  const [files, setFiles] = useState<File[]>([]);
  const [activeUploads, setActiveUploads] = useState<number>(0);

  const onFinish = async (values: any) => {
  const { filenameTemplate, uploadBatchId, startIndex } = values;

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

  setActiveUploads(files.length);

  const startIdx = Number(startIndex) || 0;

  const uploadPromises = files.map((file, i) => {
    const originalName = file.name;
    const ext = originalName.split(".").pop()?.toLowerCase() || "";
    const guessedType = FILE_TYPE_MAP[ext] || FileType.OTHER;

    const filename = `${filenameTemplate.replace("{{index}}", (startIdx + i).toString())}.${ext}`;

    const key = `upload-${originalName}-${Math.random().toString(36).substring(7)}`;

    notification.info({
      key,
      message: `Загрузка: ${originalName}`,
      description: <Progress percent={0} />,
      duration: 0,
    });

    return new Promise<void>(async (resolve, reject) => {
      const attemptUpload = async (attemptIndex: number) => {
        try {
          const finalFilename = `${filenameTemplate.replace("{{index}}", attemptIndex.toString())}.${ext}`;

          const presignedUrl = await uploadFile({
            filename: finalFilename,
            fileType: guessedType,
            uploadBatchId,
          });

          await uploadToPresignedUrl(presignedUrl, file, (progress) => {
            setProgress(key, progress);
          });

          notification.success({
            key,
            message: `Файл ${originalName} загружен`,
            description: `Имя файла: ${finalFilename}`,
            duration: 3,
          });

          resolve();
        } catch (error: any) {
          const status = error?.response?.status;

          if (status === 409) {
            notification.warning({
              key,
              message: `Файл "${filename}" уже существует`,
              description: (
                <>
                  <p>Файл "{originalName}" не загружен из-за конфликта имён.</p>
                </>
              ),
              duration: 0,
            });
            reject(new Error("Конфликт имён"));
          } else {
            notification.error({
              key,
              message: `Ошибка: ${originalName}`,
              description: error.message,
              duration: 3,
            });
            reject(error);
          }
        }
      };

      attemptUpload(startIdx + i);
    });
  });

  try {
    await Promise.all(uploadPromises);
    notification.success({ message: "Все файлы успешно загружены" });
  } catch (error) {
    notification.error({ message: "Не все файлы загружены" });
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
    setFiles((prev) => [...prev, file]);
    return false;
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card title="Загрузить файл" className="max-w-md mx-auto">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Выберите файлы (до 5)">
          <div className="flex flex-col gap-2 mb-4">
            <Upload
              multiple
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="*"
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
        <Form.Item
          label="Шаблон имени файла"
          name="filenameTemplate"
          rules={[{ required: true }]}
          initialValue="file-{{index}}"
        >
          <Input placeholder="file-{{index}}" />
        </Form.Item>
        <Form.Item
          label="Начальный индекс"
          name="startIndex"
          rules={[{ required: true, min: 0 }]}
          initialValue={0}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Batch ID"
          name="uploadBatchId"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isPending || activeUploads >= MAX_FILES}
            loading={isPending || activeUploads > 0}
            className="w-full mt-4"
          >
            {isPending || activeUploads > 0
              ? `${activeUploads} файлов в очереди...`
              : "Загрузить файлы"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
