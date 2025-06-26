import { createFileRoute } from "@tanstack/react-router";
// import FilterCard from "../widgets/filterCard";
// import { Card, Col, Row, Table } from "antd";
// import { Select } from "antd";
import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { useGetUser } from "../features/user";
import { useGetTrains } from "../features/train";
import ModalButton from "../widgets/modalButton";
import TrainTable from "../widgets/trainTable";
import CreateTrainForm from "../widgets/createTrainForm";
import CreateBranchForm from "../widgets/createBranchForm";
import UploadFileForm from "../widgets/uploadFileForm";

export const MainPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <ModalButton buttonText="Добавить поезд" type='train' />
      <ModalButton buttonText="Добавить филиал" type="branch"/>
    </div>
  );
};
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
  return <MainPage/>;

//   //   return <CreateTrainForm/>;

//     return <CreateBranchForm/>;
// //   return (
// //     <div className="p-4">
// //       <strong>{user?.name}</strong>
// //     </div>
// //   );
  // return <CreateBranchForm/>;
  return <UploadFileForm />;
  //   return (
  //     <div className="p-4">
  //       <strong>{user?.name}</strong>
  //     </div>
  //   );
}
