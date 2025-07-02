import React from "react";
import { DatePicker, Select, Input, Button, Form } from "antd";

const { Option } = Select;

export default function FilterCard() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Фильтр применён:", values);
  };

  return (
    <div className="border border-gray-300 p-4 w-full max-w-xs">
      <h2 className="text-xl font-bold mb-4">Фильтр</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-2"
      >
        <Form.Item name="departureDate">
          <DatePicker
            placeholder="Дата отправления"
            className="w-full"
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item name="arrivalDate">
          <DatePicker
            placeholder="Дата прибытия"
            className="w-full"
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item name="fileDate">
          <DatePicker
            placeholder="Дата создания файла"
            className="w-full"
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item name="employee">
          <Select placeholder="Работник" allowClear>
            <Option value="ivanov">Иванов</Option>
            <Option value="petrov">Петров</Option>
          </Select>
        </Form.Item>

        <Form.Item name="supervisor">
          <Select placeholder="Начальник" allowClear>
            <Option value="sidorov">Сидоров</Option>
            <Option value="nikolaev">Николаев</Option>
          </Select>
        </Form.Item>

        <Form.Item name="trainNumber">
          <Select placeholder="Номер поезда" allowClear>
            <Option value="123">123</Option>
            <Option value="456">456</Option>
          </Select>
        </Form.Item>

        <Form.Item name="branch">
          <Select placeholder="Филиал" allowClear>
            <Option value="moscow">Москва</Option>
            <Option value="spb">СПб</Option>
          </Select>
        </Form.Item>

        <Form.Item name="keywords">
          <Input placeholder="Ключевые слова" allowClear/>
        </Form.Item>

        <Form.Item className="flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-red-600 !text-white !border-none"
          >
            Поиск
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
