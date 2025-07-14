import { Form, Button, Modal, Select, DatePicker } from "antd";
import { notification } from "antd";
import { useCreateDelegation } from "../features/delegat";
import { useGetUsers } from "../features/user";
import type { DelegationRequest } from "../services/delegat";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

type CreateDelegateFormProps = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateDelegateForm({
  open,
  onCancel,
}: CreateDelegateFormProps) {
  const [form] = Form.useForm();
  const { mutate: createDelegation, isPending } = useCreateDelegation();
  const { data: users } = useGetUsers();

  const openSuccessNotification = () => {
    notification.success({
      message: "Делегирование успешно произведено",
      duration: 3,
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Произошла ошибка при делегации обязанностей",
      duration: 3,
    });
  };

  const onFinish = (values: any) => {
    const payload: DelegationRequest = {
      delegatorId: 3,
      substituteId: values.substitute,
      fromDate: (values.dateRange[0]).format("YYYY-MM-DD"),
      toDate: (values.dateRange[1]).format("YYYY-MM-DD"),
    };

    createDelegation(payload, {
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
      centered
      destroyOnHidden={true}
    >
      <div className="text-xl px-6 pt-6 pb-4 text-center">
        Делегирование обязанностей
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 px-6 py-4 text-base"
      >
        
        <Form.Item
          name="substitute"
          rules={[{ required: true, message: "Выберите сотрудника" }]}
        >
          <Select placeholder="Выберите сотрудника, которому делегируются обязанности" allowClear>
            {users?.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.surname} {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

    
        <Form.Item
          name="dateRange"
          label="Период делегирования"
          rules={[{ required: true, message: "Выберите период" }]}
        >
          <RangePicker
            className="w-full"
            format="DD.MM.YYYY"
            placeholder={["Выберите", "период"]}
          />
        </Form.Item>

        <Form.Item className="mt-6">
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