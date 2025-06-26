import { Form, Input, Button, Modal, Select, Checkbox } from "antd";
import { useState } from "react";
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

  const [hasParent, setHasParent] = useState(false);

  const onFinish = (values: BranchRequest) => {
    if (!hasParent) {
      delete values.parent;
    }
    createBranch(values);
    form.resetFields();
    setHasParent(false);
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

        <Form.Item>
          <Checkbox
            checked={hasParent}
            onChange={(e) => setHasParent(e.target.checked)}
          >
            Выбрать родительский филиал
          </Checkbox>
        </Form.Item>

        {hasParent && (
          <Form.Item
            name={["parent", "id"]}
            rules={[
              { required: true, message: "Выберите родительский филиал" },
            ]}
          >
            <Select
              placeholder="Родительский филиал"
              options={parents.map((parent) => ({
                label: parent.name,
                value: parent.id,
              }))}
              allowClear
            />
          </Form.Item>
        )}

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
