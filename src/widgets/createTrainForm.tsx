import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload, notification } from "antd";
import { useCreateTrain } from "../features/train";
import { useGetBranches } from "../features/branch/useGetBranches";
import { useUploadTrainSchedules } from "../features/train";
import type { TrainResponse } from "../services/train";
import { useGetChiefs } from "../features/train/useGetChiefs";

const { Option } = Select;

type CreateTrainFormProps = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateTrainForm({
  open,
  onCancel,
}: CreateTrainFormProps) {
  const [form] = Form.useForm();
  const { mutate: createTrain, isPending } = useCreateTrain();
  const { mutate: uploadSchedules, isPending: isUploading } =
    useUploadTrainSchedules();
  const { data: branches } = useGetBranches();
  const { data: chiefs} = useGetChiefs();

  const openSuccessNotification = (message: string) => {
    notification.success({
      message,
      duration: 5,
    });
  };

  const openErrorNotification = (message: string) => {
    notification.error({
      message,
      duration: 5,
    });
  };

  const onFinish = (values: any) => {
    const payload: TrainResponse = {
      trainNumber: Number(values.trainNumber),
      routeMessage: values.routeMessage,
      consistCount: Number(values.consistCount),
      chiefId: Number(values.chiefId),
      branchId: Number(values.branchId),
    };

    createTrain(payload, {
      onSuccess: () => {
        openSuccessNotification("Поезд успешно создан");
        form.resetFields();
        onCancel();
      },
      onError: () => {
        openErrorNotification("Произошла ошибка при создании поезда");
      },
    });
  };

  const handleUpload = (file: File) => {
    uploadSchedules(file, {
      onSuccess: (response) => {
        const lines = [
          `Всего записей: ${response.totalRecords}`,
          `Успешно загружено: ${response.successfullyParsed}`,
          `С ошибками: ${response.recordsWithError}`,
          `Уже в базе: ${response.existingRecordsInDb}`,
          `Обновлено: ${response.updatedRecords}`,
        ];

        if (response.errorMessages.length) {
          lines.push("Ошибки:");
          response.errorMessages.forEach((msg) => {
            lines.push(`- ${msg}`);
          });
        }

        notification.success({
          message: "Файл успешно загружен",
          description: lines.join("\n"),
          duration: 6,
        });
      },
      onError: () => {
        openErrorNotification("Ошибка загрузки файла");
      },
    });

    return false;
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden={true}
      centered
      width={300}
    >
      <div className="text-xl px-6 pt-6 pb-4 text-center">Создание поезда</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 px-6 py-4 text-xl"
      >
        <Form.Item
          name="trainNumber"
          rules={[{ required: true, message: "Введите номер поезда" }]}
        >
          <Input type="number" placeholder="Номер поезда" />
        </Form.Item>

        <Form.Item
          name="routeMessage"
          rules={[{ required: true, message: "Введите маршрут" }]}
        >
          <Input placeholder="Маршрут" />
        </Form.Item>

        <Form.Item
          name="chiefId"
          rules={[{ required: true, message: "Выберите начальника" }]}
        >
          <Select placeholder="Начальник" allowClear>
            {chiefs?.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.surname} {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="branchId"
          rules={[{ required: true, message: "Выберите филиал" }]}
        >
          <Select placeholder="Филиал" allowClear>
            {branches?.map((branch) => (
              <Select.Option key={branch.id} value={branch.id}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="consistCount"
          rules={[{ required: true, message: "Введите количество вагонов" }]}
        >
          <Input type="number" placeholder="Количество вагонов" />
        </Form.Item>

        <Form.Item
          label="Вы можете выгрузить данные о поездах из таблицы Excel"
          labelCol={{ span: 24 }}
        >
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept=".xlsx,.xls"
          >
            <Button
              icon={<UploadOutlined />}
              block
              loading={isUploading}
              className="mb-2"
            >
              Загрузить Excel
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            className="!bg-red-600 !text-white !border-none"
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
          >
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
