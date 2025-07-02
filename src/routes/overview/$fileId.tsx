import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Table, Space, Col, Row } from "antd";

export const Route = createFileRoute("/overview/$fileId")({
  component: OverviewComponent,
});

function OverviewComponent() {
  const { fileId } = Route.useParams();
  const videoUrl = "https://example.com/video.mp4 "; // URL вашего видео

  const trainDetails = {
    departureDate: "14.07.2025",
    arrivalDate: "15.07.2025",
    trainNumber: "148",
    chiefName: "Михайлов М.М.",
    workerName: "Михайлов М.М.",
  };

  const attachedFiles = [
    { name: "file1.mp4", duration: "1:23" },
    { name: "file2.mp4", duration: "2:45" },
    { name: "file3.mp4", duration: "3:00" },
    { name: "file4.mp4", duration: "4:15" },
    { name: "file5.mp4", duration: "5:30" },
    { name: "file6.mp4", duration: "6:45" },
  ];
  return (
    <div className="flex flex-col p-10 pt-0 gap-8">
      <div className="flex justify-center pt-3">
        <video controls style={{ width: "100%", maxWidth: "1000px" }}>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Button
        className="!bg-red-600 !text-white !border-none !w-fit"
        // type="primary"
        htmlType="submit"
        // loading={isPending}
        block
      >
        Прикрепить файл
      </Button>

      <div className="flex flex-col">
        <Card title="Подробная информация" className="">
          <Table
            dataSource={[
              {
                key: "departureDate",
                label: "Дата отправления:",
                value: trainDetails.departureDate,
              },
              {
                key: "arrivalDate",
                label: "Дата прибытия:",
                value: trainDetails.arrivalDate,
              },
              {
                key: "trainNumber",
                label: "Номер поезда:",
                value: trainDetails.trainNumber,
              },
              {
                key: "chiefName",
                label: "ФИО начальника:",
                value: trainDetails.chiefName,
              },
              {
                key: "workerName",
                label: "ФИО работника:",
                value: trainDetails.workerName,
              },
            ]}
            columns={[
              {
                title: "",
                dataIndex: "label",
                key: "label",
              },
              {
                title: "",
                dataIndex: "value",
                key: "value",
              },
            ]}
            pagination={false}
          />
        </Card>
      </div>
      <Card title="Прикрепленные файлы">
        <Row gutter={16}>
          {attachedFiles.map((file, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <div>
                <video controls style={{ width: "100%" }}>
                  <source
                    src={`https://example.com/ ${file.name}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <p>
                  {file.name} ({file.duration})
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
