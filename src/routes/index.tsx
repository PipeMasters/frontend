import { createFileRoute } from "@tanstack/react-router";
// import FilterCard from "../widgets/filterCard";
// import { Card, Col, Row, Table } from "antd";
// import { Select } from "antd";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { useGetUser } from "../features/user";
import { useGetTrains } from "../features/train";
import ModalButton from "../widgets/modalButton";
import BatchVideo  from "../widgets/batchVideo";
import FilterCard from "../widgets/filterCard";

const { RangePicker } = DatePicker;

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  //   const { data: user, isLoading } = useGetUser(1);
  const { data: trains = [], isLoading } = useGetTrains();
  const { data: user } = useGetUser(1);
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
 
  return (
    <div className="flex p-4 gap-10">
    
      <div className="flex flex-col w-72 space-y-4">
        <FilterCard />
        <ModalButton buttonText="Добавить поезд" type="train" />
        <ModalButton buttonText="Добавить филиал" type="branch" />
      </div>

    
      <div className="flex-1">
        <BatchVideo/>
      </div>
    </div>
  );
};


