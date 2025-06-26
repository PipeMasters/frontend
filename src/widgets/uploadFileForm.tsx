import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Upload,
  Progress,
} from "antd";
import { useUploadFile } from "../features/file/useUploadFile";
import { FileType } from "../services/file/model";
import { notification } from "antd";
export default function UploadFileForm() {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState(false);
  const { getPresignedUrlAsync, uploadToPresignedUrl, isPending } =
    useUploadFile();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const openProgressNotification = () => {
    const key = `upload-progress`;

    notification.info({
      key,
      message: "Загрузка файла",
      description: (
        <div className="w-52">
          <Progress percent={0} id={key} />
        </div>
      ),
      duration: 0,
    });

    return key;
  };

  const updateProgressNotification = (key: string, percent: number) => {
    notification.info({
      key,
      message: "Загрузка файла",
      description: (
        <div className="w-52">
          <Progress percent={percent} />
        </div>
      ),
      duration: 0,
    });
  };

  const onFinish = async (values: any) => {
    if (!file) {
      notification.error({
        message: "Ошибка",
        description: "Выберите файл для загрузки",
        duration: 3,
      });
      return;
    }

    const key = openProgressNotification();

    setIsUploading(true);

    try {
      const presignedUrl = await getPresignedUrlAsync({
        ...values,
        filename: values.filename,
      });

      await uploadToPresignedUrl(presignedUrl, file, (progress) => {
        setUploadProgress(progress);
        updateProgressNotification(key, progress);
      });

      notification.success({
        message: "Файл загружен",
        description: `Файл "${values.filename}" успешно загружен.`,
        duration: 3,
      });

      setTimeout(() => notification.destroy(key), 1500);
      form.resetFields();
      setFile(null);
    } catch (error) {
      notification.error({
        key,
        message: "Ошибка загрузки",
        description: "Произошла ошибка при загрузке файла.",
        duration: 3,
      });

      console.error(error);
    } finally {
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const validateFilename = (_: any, value: string) => {
    const filenameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9_\-]+(\.[a-zA-Z0-9_\-]+)+$/;
    if (!value || filenameRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Введите корректное имя файла, например: video.mp4")
    );
  };

  const beforeUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    return false;
  };

  return (
    <Card title="Загрузить файл" className="max-w-[576px] m-auto!">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Выберите файл">
          <div className="flex flex-col gap-2">
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="*"
            >
              <Button>Выбрать файл</Button>
            </Upload>

            {file && (
              <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded w-full">
                <span className="text-sm text-gray-600">
                  Выбран файл:{" "}
                  <strong className="font-medium">{file.name}</strong>
                </span>
                <Button danger size="small" onClick={() => setFile(null)}>
                  Очистить
                </Button>
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item
          label="Имя файла"
          name="filename"
          rules={[{ required: true }, { validator: validateFilename }]}
        >
          <Input placeholder="video.mp4" />
        </Form.Item>
        <Form.Item
          label="Тип файла"
          name="fileType"
          rules={[{ required: true, message: "Выберите тип файла" }]}
        >
          <Select>
            {Object.keys(FileType)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <Select.Option
                  key={key}
                  value={FileType[key as keyof typeof FileType]}
                >
                  {key}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Batch ID"
          name="uploadBatchId"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isPending || isUploading}
          loading={isPending || uploadProgress > 0}
          className="w-full mt-4"
        >
          {isPending
            ? "Получение ссылки..."
            : isUploading
              ? "Загрузка..."
              : "Загрузить файл"}
        </Button>
      </Form>
    </Card>
  );
}
