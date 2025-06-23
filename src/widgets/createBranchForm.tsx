import { Form, Input, Button, Card } from "antd";
import { useCreateBranch } from "../features/branch";
import type { BranchRequest } from "../services/branch";

export default function CreateBranchForm() {
  const [form] = Form.useForm();
  const { mutate: createBranch, isPending } = useCreateBranch();

  const onFinish = (values: BranchRequest) => {
    createBranch(values);
    form.resetFields();
  };

  return (
    <Card title="Создать филиал" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Название" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="ID родителя"
          name={["parent", "id"]}
          rules={[{ required: false, type: "number" }]}
        >
          <Input type="number" placeholder="Опционально" />
        </Form.Item>

        <Form.Item
          label="Название родителя"
          name={["parent", "name"]}
          rules={[{ required: false }]}
        >
          <Input placeholder="Опционально" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isPending}>
          Создать филиал
        </Button>
      </Form>
    </Card>
  );
}
