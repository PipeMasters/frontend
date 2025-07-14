import { Button, Form, Input, Modal, Select } from "antd";
import { notification } from "antd";
import { useCreateUser } from "../features/user";
import { useGetBranches } from "../features/branch/useGetBranches";
import { RoleEnum, type UserResponse } from "../services/user";

const { Option } = Select;

type CreateUserFormProps = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateUserForm({
  open,
  onCancel,
}: CreateUserFormProps) {
  const [form] = Form.useForm();
  const { mutate: createUser, isPending } = useCreateUser();
  const { data: branches } = useGetBranches();

  const openSuccessNotification = () => {
    notification.success({
      message: "Пользователь успешно создан",
      duration: 3,
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Произошла ошибка при создании пользователя",
      duration: 3,
    });
  };

  const onFinish = (values: any) => {
    const payload: UserResponse = {
      name: values.name,
      surname: values.surname,
      patronymic: values.patronymic,
      roles: [values.role],
      branchId: Number(values.branchId),
    };

    createUser(payload, {
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
      <div className="text-xl px-6 pt-6 pb-4 text-center">Создание пользователя</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 px-6 py-4 text-xl"
      >
        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Введите фамилию" }]}
        >
          <Input placeholder="Фамилия пользователя" />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Введите имя" }]}
        >
          <Input placeholder="Имя пользователя" />
        </Form.Item>

        <Form.Item
          name="patronymic"
          rules={[{ required: true, message: "Введите отчество" }]}
        >
          <Input placeholder="Отчество пользователя" />
        </Form.Item>

        <Form.Item
          name="role"
          rules={[{ required: true, message: "Выберите роль" }]}
        >
          <Select placeholder="Выберите роль">
            {Object.values(RoleEnum).map((role) => (
              <Option key={role} value={role}>
                {role}
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
