import { createFileRoute } from "@tanstack/react-router";
import FilterCard from "../widgets/filterCard";
import { Card, Col, Row, Table } from "antd";
import { Select } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { useGetUser } from "../features/user";
import { useGetTrains } from "../features/train";
import TrainTable from "../widgets/trainTable";
import CreateTrainForm from "../widgets/createTrainForm";

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
  //   const { data: user, isLoading } = useGetUser(1);
  const { data: trains = [], isLoading } = useGetTrains();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return <CreateTrainForm/>;
}
