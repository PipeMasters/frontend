import { Form, Input, Button, Modal, Select, Checkbox, DatePicker, notification, } from "antd";
import { useState } from "react";
import { useCreateBatch } from "../features/batch";
import type { BatchRequest } from "../services/batch";
import { Cause } from "../services/batch";
import { useGetTrains } from "../features/train";
import { useGetBranches } from "../features/branch/useGetBranches";
import dayjs from "dayjs";

type CreateBatchFormProps = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateBatchForm({
  open,
  onCancel,
}: CreateBatchFormProps) {
  const [form] = Form.useForm();
  const { mutate: createBatch, isPending } = useCreateBatch();
  const [noVideo, setNoVideo] = useState(false);

  const { data: trains } = useGetTrains();
  const { data: branches } = useGetBranches();

  const openSuccessNotification = () => {
    notification.success({
      message: "Запись успешно создана",
      duration: 3,
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Произошла ошибка при создании записи",
      duration: 3,
    });
  };

  const onFinish = (values: any) => {
    const payload: BatchRequest = {
      uploadedById: 1,
      trainDeparted: dayjs(values.trainDeparted).format("YYYY-MM-DD"),
      trainArrived: dayjs(values.trainArrived).format("YYYY-MM-DD"),
      trainId: values.trainId,
      comment: values.comment || "",
      branchId: values.branchId,
    };

    if (noVideo) {
      payload.absence = {
        cause: values.absence?.cause,
        comment: values.absence?.comment || "",
      };
    }

    createBatch(payload, {
      onSuccess: () => {
        openSuccessNotification();
        form.resetFields();
        setNoVideo(false);
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
      title="Создание батча"
      destroyOnHidden={true}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="trainDeparted"
          label="Дата отправления"
          rules={[{ required: true, message: "Выберите дату отправления" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="trainArrived"
          label="Дата прибытия"
          rules={[{ required: true, message: "Выберите дату прибытия" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="trainId"
          label="Номер поезда"
          rules={[{ required: true, message: "Выберите поезд" }]}
        >
          <Select placeholder="Номер поезда" allowClear>
            {trains?.map((train) => (
              <Select.Option key={train.id} value={train.id}>
                {train.trainNumber}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="branchId"
          label="Филиал"
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

        <Form.Item name="comment" label="Комментарий">
          <Input placeholder="Комментарий" allowClear />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={noVideo}
            onChange={(e) => setNoVideo(e.target.checked)}
          >
            Отсутствует видео?
          </Checkbox>
        </Form.Item>

        {noVideo && (
          <>
            <Form.Item
              name={["absence", "cause"]}
              label="Причина отсутствия"
              rules={[{ required: true, message: "Выберите причину" }]}
            >
              <Select placeholder="Причина отсутствия" allowClear>
                <Select.Option value={Cause.DEVICE_FAILURE}>
                  Поломка оборудования
                </Select.Option>
                <Select.Option value={Cause.REGULATORY_EXEMPT}>
                  Непредвиденное обстоятельство
                </Select.Option>
                <Select.Option value={Cause.HUMAN_FACTOR}>
                  Человеческий фактор
                </Select.Option>
                <Select.Option value={Cause.OTHER}>Другое</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={["absence", "comment"]}
              label="Комментарий к отсутствию"
            >
              <Input placeholder="Комментарий" allowClear />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            className="w-full !bg-red-600 !border-none"
          >
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
