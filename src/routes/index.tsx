import { createFileRoute } from "@tanstack/react-router";
import FilterCard from "../widgets/filterCard";
import { Card, Col, Row } from "antd";
import { Select } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { useGetUser } from "../features/user";

const { RangePicker } = DatePicker;

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const fetchWorkers = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  ); // замени на свой URL
  return response.data.map((worker: any) => ({
    value: worker.id,
    label: worker.name,
  }));
};

function RouteComponent() {
  const { data: user, isLoading } = useGetUser(1);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Card
      title="Список пользователей"
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <p>
        <strong>ФИО:</strong> {user?.surname} {user?.name} {user?.patronymic}
      </p>
      <p>
        <strong>Филиал:</strong> {user?.branch.name}
      </p>
      <p>
        <strong>Role:</strong> {user?.roles}
      </p>
    </Card>
  );
}
