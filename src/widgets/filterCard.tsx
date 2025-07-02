import React from "react";
import { DatePicker, Select, Input, Button, Form, Spin } from "antd";
import { useGetUsers } from "../features/user";
import { useGetTrains } from "../features/train";
import { RoleEnum } from "../services/user";
import { useGetBranches } from "../features/branch/useGetBranches";

const { Option } = Select;

export default function FilterCard() {
  const [form] = Form.useForm();

  const { data: users, isLoading } = useGetUsers();
  const { data: trains} = useGetTrains();
  const { data: branches} = useGetBranches();

  const workers =
    users?.filter((user) => user.roles.includes(RoleEnum.USER)) ?? [];
  const chief =
    users?.filter((user) => user.roles.includes(RoleEnum.BRANCH_ADMIN)) ?? [];

  const onFinish = (values: any) => {
    console.log("Фильтр применён:", values);
  };

  return (
    <div className="border border-gray-300 p-4 w-full max-w-xs">
      <h2 className="text-xl font-bold mb-4">Фильтр</h2>

      {isLoading ? (
        <Spin />
      ) : (
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
              {workers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.surname} {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="supervisor">
            <Select placeholder="Начальник" allowClear>
              {chief.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.surname} {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="trainNumber">
            <Select placeholder="Номер поезда" allowClear>
              {trains?.map((train) => (
                <Option key={train.trainNumber} value={train.trainNumber}>
                  {train.trainNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="branch">
            <Select placeholder="Филиал" allowClear>
              {branches?.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="keywords">
            <Input placeholder="Ключевые слова" allowClear />
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
      )}
    </div>
  );
}
