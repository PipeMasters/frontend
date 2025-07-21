import { useEffect } from "react";
import { DatePicker, Select, Button, Form, Spin } from "antd";
import { useGetUsers } from "../features/user";
import { useGetTrains } from "../features/train";
import { RoleEnum } from "../services/user";
import { useGetBranches } from "../features/branch/useGetBranches";
import type { BatchQueryParams } from "../services/batch";
import { useFilterState, useFilterActions } from "../store/filterStore";
import dayjs from "dayjs";

const { Option } = Select;

interface FilterCardProps {
  onFilter: (params: BatchQueryParams) => void;
}

export default function FilterCard({ onFilter }: FilterCardProps) {
  const filters = useFilterState();
  const { setFilters, resetFilters } = useFilterActions();

  const { data: users, isLoading } = useGetUsers();
  const { data: trains } = useGetTrains();
  const { data: branches } = useGetBranches();
  const [form] = Form.useForm();

  const workers = users?.filter((user) => user.roles.includes(RoleEnum.USER));
  const chiefs = users?.filter((user) =>
    user.roles.includes(RoleEnum.BRANCH_ADMIN)
  );

  useEffect(() => {
    form.setFieldsValue(convertParamsToFormValues(filters));
  }, [filters, form]);

  const onFinish = (values: any) => {

    const keywordsString = Array.isArray(values.keywords)
      ? values.keywords.join(", ")
      : values.keywords;

    const params: BatchQueryParams = {
      trainId: values.trainId,
      uploadedById: values.workers,
      chiefId: values.chiefs,
      branchId: values.branch,
      keywords: keywordsString,
      departureDateFrom: values.departureDateRange?.[0]?.format("YYYY-MM-DD"),
      departureDateTo: values.departureDateRange?.[1]?.format("YYYY-MM-DD"),
      arrivalDateFrom: values.arrivalDateRange?.[0]?.format("YYYY-MM-DD"),
      arrivalDateTo: values.arrivalDateRange?.[1]?.format("YYYY-MM-DD"),
      createdFrom: values.createdDateRange?.[0]?.toISOString(),
      createdTo: values.createdDateRange?.[1]?.toISOString(),
      page: filters.page,
      size: filters.size,
    };

    setFilters(params);
    onFilter(params);
  };

  const handleReset = () => {
    resetFilters();
    form.resetFields();
    onFilter({});
  };

  const convertParamsToFormValues = (params: BatchQueryParams): any => {
    return {
      trainId: params.trainId,
      workers: params.uploadedById,
      chiefs: params.chiefId,
      branch: params.branchId,
      keywords: params.keywords
        ? params.keywords.split(",").map((k) => k.trim())
        : undefined,
      departureDateRange:
        params.departureDateFrom && params.departureDateTo
          ? [dayjs(params.departureDateFrom), dayjs(params.departureDateTo)]
          : undefined,
      arrivalDateRange:
        params.arrivalDateFrom && params.arrivalDateTo
          ? [dayjs(params.arrivalDateFrom), dayjs(params.arrivalDateTo)]
          : undefined,
      createdDateRange:
        params.createdFrom && params.createdTo
          ? [dayjs(params.createdFrom), dayjs(params.createdTo)]
          : undefined,
    };
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
          <Form.Item
            name="departureDateRange"
            label="Диапазон даты отправления"
          >
            <DatePicker.RangePicker
              className="w-full"
              format="DD.MM.YYYY"
              placeholder={["Выберите", "даты"]}
            />
          </Form.Item>

          <Form.Item name="arrivalDateRange" label="Диапазон даты прибытия">
            <DatePicker.RangePicker
              className="w-full"
              format="DD.MM.YYYY"
              placeholder={["Выберите", "даты"]}
            />
          </Form.Item>

          <Form.Item name="createdDateRange" label="Диапазон даты создания">
            <DatePicker.RangePicker
              className="w-full"
              format="DD.MM.YYYY"
              placeholder={["Выберите", "даты"]}
            />
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

          <Form.Item name="workers">
            <Select placeholder="Работник" allowClear>
              {workers?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.surname} {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="chiefs">
            <Select placeholder="Начальник" allowClear>
              {chiefs?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.surname} {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="trainId">
            <Select placeholder="Номер поезда" allowClear>
              {trains?.map((train) => (
                <Option key={train.id} value={train.id}>
                  {train.trainNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="keywords">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Введите ключевые слова"
              tokenSeparators={[",", " "]}
              allowClear
              open={false}
              suffixIcon={null}
            />
          </Form.Item>

          <Form.Item className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="!bg-red-600 !text-white !border-none mr-4"
            >
              Поиск
            </Button>

            <Button
              htmlType="button"
              onClick={handleReset}
              className="!bg-gray-300 !text-black !border-none"
            >
              Сбросить фильтры
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
