import { Button, Form, Input, Modal, Select } from "antd";
import { notification } from "antd";
import { useCreateTrain } from "../features/train";
import { useGetBranches } from "../features/branch/useGetBranches";
import type { TrainResponse } from "../services/train";
import { RoleEnum } from "../services/user";
import { useGetUsers } from "../features/user";

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
  const { data: branches } = useGetBranches();
  const { data: users } = useGetUsers();
  const chief = users?.filter((user) =>
    user.roles.includes(RoleEnum.BRANCH_ADMIN)
  );

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
      openSuccessNotification();
      form.resetFields();
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

        <Form.Item name="chiefId">
          <Select placeholder="Начальник" allowClear>
            {chief?.map((user) => (
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
