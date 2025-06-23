import { Card, Table } from "antd";
import type { TrainResponse } from "../services/train";
const columns = [
  {
    title: "Номер поезда",
    dataIndex: "trainNumber",
    key: "trainNumber",
  },
  {
    title: "Маршрут",
    dataIndex: "routeMessage",
    key: "routeMessage",
  },
  {
    title: "Кол-во вагонов",
    dataIndex: "consistCount",
    key: "consistCount",
  },
  {
    title: "Начальник поезда",
    dataIndex: "chief",
    key: "chief",
  },
];
interface TrainTableProps {
  trains: TrainResponse[];
}
export default function TrainTable({ trains }: TrainTableProps) {
  return (
    <Card title="Список поездов" style={{ maxWidth: 1000, margin: "auto" }}>
      <Table dataSource={trains} columns={columns} rowKey="trainNumber" />
    </Card>
  );
}
