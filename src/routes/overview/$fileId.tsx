import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Table, Space, Col, Row, Tag, Progress } from "antd";
import { useGetBatch } from "../../features/batch";
import { useGetTrain } from "../../features/train";
import { getCauseLabel } from "../../services/batch";
import { useGetFileUrls } from "../../features/file";
import { FILE_TYPE_MAP, FileType } from "../../services/file";

export const Route = createFileRoute("/overview/$fileId")({
  component: OverviewComponent,
});

function OverviewComponent() {
  const { fileId } = Route.useParams();

  const { data: batch, isLoading, isError } = useGetBatch(parseInt(fileId));
  const trainId = batch?.trainId;
  const trainQuery = useGetTrain(trainId ?? 1);
  const train = trainQuery.data;

  const fileIds = batch?.files?.map((file) => file.id) ?? [];
  const fileQueries = useGetFileUrls(fileIds);

  if (isLoading || trainQuery.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError || !batch || trainQuery.isError || !train) {
    return <div>Ошибка загрузки</div>;
  }

  const videoUrl =
    "http://92.242.60.137:9000/dev-bucket/d8dbece3-cf14-441b-a877-8cb95f08ce73/file-3.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250707T140502Z&X-Amz-SignedHeaders=host&X-Amz-Credential=spring%2F20250707%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Expires=600&X-Amz-Signature=c67eac6664b11e952865bfc3e6e31285df6cdd212550eb695a9206b4ee30dbe1";

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

  return (
    <div className="flex flex-col p-10 pt-0 gap-8">
      <div className="flex justify-center pt-3">
        <video controls style={{ width: "100%", maxWidth: "1000px" }}>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Button className="!bg-red-600 !text-white !border-none !w-fit" block>
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Видео</h3>
          <Row gutter={[24, 24]}>
            {fileQueries.map((query, index) => {
              const file = batch.files[index];
              const ext =
                file.filename.split(".").pop()?.toLowerCase() || "other";
              const fileType = FILE_TYPE_MAP[ext];

              if (query.isLoading) return null;
              if (query.isError) return null;

              if (fileType === FileType.VIDEO) {
                const url = query.data;
                return (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <div className="p-3 bg-white shadow rounded">
                      <video controls style={{ width: "100%" }}>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <span>{file.filename}</span>
                      <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-center text-blue-500 hover:text-blue-700"
                      >
                        Скачать
                      </a>
                    </div>
                  </Col>
                );
              }

              return null;
            })}
          </Row>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Аудиозаписи</h3>
          <Row gutter={[24, 24]}>
            {fileQueries.map((query, index) => {
              const file = batch.files[index];
              const ext =
                file.filename.split(".").pop()?.toLowerCase() || "other";
              const fileType = FILE_TYPE_MAP[ext];

              if (query.isLoading) return null;
              if (query.isError) return null;

              if (fileType === FileType.AUDIO) {
                const url = query.data;
                return (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <div className="p-3 bg-white shadow rounded">
                      <audio controls style={{ width: "100%" }}>
                        <source src={url} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                      </audio>
                      <span>{file.filename}</span>
                      <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-center text-blue-500 hover:text-blue-700"
                      >
                        Скачать
                      </a>
                    </div>
                  </Col>
                );
              }

              return null;
            })}
          </Row>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Документы</h3>
          <Row gutter={[24, 24]}>
            {fileQueries.map((query, index) => {
              const file = batch.files[index];
              const ext =
                file.filename.split(".").pop()?.toLowerCase() || "other";
              const fileType = FILE_TYPE_MAP[ext];

              if (query.isLoading) return null;
              if (query.isError) return null;

              if (fileType === FileType.DOCUMENT) {
                const url = query.data;
                return (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <div className="p-3 bg-white shadow rounded flex flex-col items-center">
                      <span>📄 {file.filename}</span>
                      <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-center text-blue-500 hover:text-blue-700"
                      >
                        Скачать
                      </a>
                    </div>
                  </Col>
                );
              }

              return null;
            })}
          </Row>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Прочие файлы</h3>
          <Row gutter={[24, 24]}>
            {fileQueries.map((query, index) => {
              const file = batch.files[index];
              const ext =
                file.filename.split(".").pop()?.toLowerCase() || "other";
              const fileType = FILE_TYPE_MAP[ext];

              if (query.isLoading) return null;
              if (query.isError) return null;

              if (
                fileType !== FileType.VIDEO &&
                fileType !== FileType.AUDIO &&
                fileType !== FileType.DOCUMENT
              ) {
                const url = query.data;
                return (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <div className="p-3 bg-white shadow rounded flex flex-col items-center">
                      <span>📁 {file.filename}</span>
                      <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-center text-blue-500 hover:text-blue-700"
                      >
                        Скачать
                      </a>
                    </div>
                  </Col>
                );
              }

              return null;
            })}
          </Row>
        </div>
      </Card>
    </div>
  );
}
