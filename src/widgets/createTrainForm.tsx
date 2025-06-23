import React, { useState } from "react";
import { Button, Form, Input, Card } from "antd";
import { useCreateTrain } from "../features/train";
import type { TrainResponse } from "../services/train";

export default function CreateTrainForm() {
  const [form] = Form.useForm();
  const { mutate: createTrain, isPending } = useCreateTrain();

  const onFinish = (values: TrainResponse) => {
    createTrain(values);
    form.resetFields();
  };

  return (
    <Card title="Создать новый поезд" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Номер поезда"
          name="trainNumber"
          rules={[{ required: true}]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Маршрут"
          name="routeMessage"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Количество вагонов"
          name="consistCount"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Начальник поезда"
          name="chief"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isPending}>
          Создать поезд
        </Button>
      </Form>
    </Card>
  );
}
