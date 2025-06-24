import { Form, Input, Button, Modal, Select } from "antd";
import { useCreateBranch, useBranchParents } from "../features/branch";
import type { BranchRequest } from "../services/branch";

type CreateBranchFormProps = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateBranchForm({
  open,
  onCancel,
}: CreateBranchFormProps) {
  const [form] = Form.useForm();
  const { mutate: createBranch, isPending } = useCreateBranch();

  const { data: parents = [] } = useBranchParents();

  const onFinish = (values: BranchRequest) => {
    createBranch(values);
    form.resetFields();
    onCancel();
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
      <div className="text-xl px-6 pt-6 pb-4 text-center">Создание филиала</div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 px-6 py-4 text-xl"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Название" />
        </Form.Item>

        <Form.Item name={["parent", "id"]}>
          <Select
            placeholder="Родительский филиал"
            options={parents.map((parent) => ({
              label: parent.name,
              value: parent.id,
            }))}
            allowClear
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
