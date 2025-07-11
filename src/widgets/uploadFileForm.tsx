import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  Progress,
  notification,
} from "antd";
import { useUploadFile } from "../features/file/useUploadFile";
import { FileType, FILE_TYPE_MAP } from "../services/file/model";
import { uploadToPresignedUrl } from "../services/file";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function UploadFileForm({ fileId }: { fileId: number }) {
  const [form] = Form.useForm();
  const { getPresignedUrlAsync, isPending } = useUploadFile(fileId);

  const MAX_FILES = 5;
  const [files, setFiles] = useState<File[]>([]);
  const [activeUploads, setActiveUploads] = useState<number>(0);

  const onFinish = async (values: any) => {
    const { filenameTemplate, startIndex = 1 } = values;

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
    const startIdx = Number(startIndex) || 1;

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

        const index = startIdx + i;
        const filename = `${filenameTemplate.replace("{{index}}", index.toString())}.${ext}`;

        const key = `upload-${originalName}-${Math.random().toString(36).substring(7)}`;

        notification.info({
          key,
          message: `Загрузка: ${originalName}`,
          description: <Progress percent={0} />,
          duration: 0,
        });

        try {
          const presignedUrl = await getPresignedUrlAsync({
            filename,
            fileType: guessedType,
            uploadBatchId: fileId,
          });

          await uploadToPresignedUrl(presignedUrl, file, (progress) => {
            setProgress(key, progress);
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
              description: `Файл "${originalName}" не загружен так как файл с таким именем уже существует.`,
              duration: 3,
            });
          } else {
            notification.error({
              key,
              message: `Ошибка: ${originalName}`,
              description: error.message,
              duration: 3,
            });
          }
          throw error;
        }
      }

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
          label={
            <span>
              Шаблон имени файла&nbsp;
              <Tooltip
                title={
                  <div className="max-w-fit">
                    <p>
                      Используйте {"{{index}}"} для указания порядкового номера.
                    </p>
                    <ul
                      style={{
                        paddingLeft: 16,
                        margin: "8px 0",
                        listStyleType: "disc",
                      }}
                    >
                      <li>
                        <code>file-{"{{index}}"} → file-1.mp4</code>
                      </li>
                      <li>
                        <code>report-{"{{index}}"} → report-5.mp4</code>
                      </li>
                      <li>
                        <code>video-{"{{index}}"} → video-10.mp4</code>
                      </li>
                    </ul>
                  </div>
                }
              >
                <QuestionCircleOutlined style={{ color: "#1890ff" }} />
              </Tooltip>
            </span>
          }
          name="filenameTemplate"
          rules={[
            { required: true, message: "Введите шаблон имени" },
            {
              pattern: /\{\{index\}\}/,
              message: "Шаблон должен содержать {{index}}",
            },
            {
              validator: (_, value) => {
                if (value.match(/[^\p{L}0-9\-_\{\}]/gu)) {
                  return Promise.reject(
                    "Разрешены буквы (включая русские), цифры, дефисы и подчеркивания"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          initialValue="file-{{index}}"
        >
          <Input placeholder="file-{{index}}" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Начальный индекс&nbsp;
              <Tooltip
                title={
                  <div className="max-w-fit">
                    <p>Укажите начальный индекс для нумерации файлов.</p>
                  </div>
                }
              >
                <QuestionCircleOutlined style={{ color: "#1890ff" }} />
              </Tooltip>
            </span>
          }
          name="startIndex"
          normalize={(value) => Number(value) || 1}
          rules={[
            { required: true, message: "Введите начальный индекс" },
            {
              type: "number",
              min: 1,
              message: "Индекс должен быть ≥ 1",
            },
          ]}
          initialValue={1}
        >
          <Input type="number" min={1} placeholder="1" />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            disabled={isPending || activeUploads >= MAX_FILES}
            loading={isPending || activeUploads > 0}
            className="!bg-red-600 !text-white !border-none w-full"
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
