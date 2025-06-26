import { Button, Form, Input, Modal } from "antd";
import { notification } from "antd";
import { useCreateTrain } from "../features/train";
import type { TrainResponse } from "../services/train";

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

  const openSuccessNotification = () => {
    notification.success({
      message: "Поезд успешно создан",
      duration: 3,
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Произошла ошибка при создании поезда",
      duration: 3,
    });
  };

  const onFinish = (values: TrainResponse) => {
    createTrain(values, {
      onSuccess: () => {
        openSuccessNotification(), form.resetFields();
        onCancel();
      },
      onError: () => {
        openErrorNotification();
      },
    });
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
          name="chief"
          rules={[{ required: true, message: "Введите начальника поезда" }]}
        >
          <Input placeholder="Начальник поезда" />
        </Form.Item>

        <Form.Item
          name="consistCount"
          rules={[{ required: true, message: "Введите количество вагонов" }]}
        >
          <Input type="number" placeholder="Количество вагонов" />
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
