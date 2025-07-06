import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Table, Space, Col, Row, Tag } from "antd";
import { useGetBatch } from "../../features/batch";
import { useGetTrain } from "../../features/train";
import { getCauseLabel } from "../../services/batch";

export const Route = createFileRoute("/overview/$fileId")({
  component: OverviewComponent,
});

function OverviewComponent() {
  const { fileId } = Route.useParams();

  const { data: batch, isLoading, isError } = useGetBatch(parseInt(fileId));
  const trainId = batch?.trainId;
  const trainQuery = useGetTrain(trainId ?? 1);
  const train = trainQuery.data;

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError || !batch) {
    return <div>Ошибка загрузки</div>;
  }

  const videoUrl = "https://example.com/video.mp4 ";

  const tableData = [
    {
      key: "directory",
      label: "Папка загрузки",
      value: batch.directory,
    },
    {
      key: "createdAt",
      label: "Дата создания",
      value: new Date(batch.createdAt).toLocaleString(),
    },
    {
      key: "trainDeparted",
      label: "Дата отправления поезда",
      value: batch.trainDeparted,
    },
    {
      key: "trainArrived",
      label: "Дата прибытия поезда",
      value: batch.trainArrived,
    },
    {
      key: "trainId",
      label: "Номер поезда",
      value: train?.trainNumber,
    },
    {
      key: "chief",
      label: "Начальник",
      value:
        batch.chief.name +
        " " +
        batch.chief.surname +
        " " +
        batch.chief.patronymic,
    },
    {
      key: "uploadedBy",
      label: "Работник",
      value:
        batch.uploadedBy.name +
        " " +
        batch.uploadedBy.surname +
        " " +
        batch.uploadedBy.patronymic,
    },
    {
      key: "comment",
      label: "Комментарий",
      value: batch.comment || "—",
    },
    {
      key: "keywords",
      label: "Ключевые слова",
      value: batch.keywords?.length
        ? batch.keywords.map((kw) => <Tag key={kw}>{kw}</Tag>)
        : "—",
    },
    {
      key: "archived",
      label: "Архивировано",
      value: batch.archived ? "Да" : "Нет",
    },
    {
      key: "deleted",
      label: "Удалено",
      value: batch.deleted ? "Да" : "Нет",
    },
    {
      key: "absence",
      label: "Причина отсутствия видео",
      value: batch.absence
        ? `${getCauseLabel(batch.absence.cause)}: ${batch.absence.comment}`
        : "—",
    },
  ];
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
        <Card title="Подробная информация о партии">
          <Table
            size="small"
            dataSource={tableData}
            showHeader={false}
            columns={[
              {
                title: "",
                dataIndex: "label",
                key: "label",
                width: 200,
                render: (text) => <span className="font-bold">{text}</span>,
              },
              {
                title: "",
                dataIndex: "value",
                key: "value",
                render: (value) => (typeof value === "string" ? value : value),
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
