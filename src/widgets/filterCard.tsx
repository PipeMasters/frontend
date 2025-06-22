import { Card, Select } from "antd";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;
export default function FilterCard() {
  return (
    <Card title="Фильтр" variant="borderless" className="w-fit">
      <div className="flex flex-col gap-4">
        <RangePicker />
        {/* <Select
          showSearch
          placeholder="Работник"
          filterOption={(input, option) =>
            (typeof option?.label === "string"
              ? option.label.toLowerCase()
              : ""
            ).includes(input.toLowerCase())
          }
          options={users}
        /> */}
        <Select
          showSearch
          placeholder="Начальник"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "1", label: "Jack" },
            { value: "2", label: "Lucy" },
            { value: "3", label: "Tom" },
          ]}
        />
        <Select
          showSearch
          placeholder="Номер поезда"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "1", label: "Jack" },
            { value: "2", label: "Lucy" },
            { value: "3", label: "Tom" },
          ]}
        />
        <Select
          showSearch
          placeholder="Филиал"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "1", label: "Jack" },
            { value: "2", label: "Lucy" },
            { value: "3", label: "Tom" },
          ]}
        />
      </div>
    </Card>
  );
}
