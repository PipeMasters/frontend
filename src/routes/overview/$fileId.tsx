import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Table, Col, Row, Tag } from "antd";
import { useGetBatch } from "../../features/batch";
import { useGetTrain } from "../../features/train";
import { getCauseLabel } from "../../services/batch";
import { useGetFileUrls } from "../../features/file";
import { FILE_TYPE_MAP, FileType } from "../../services/file";
import UploadFileForm from "../../widgets/uploadFileForm";
import { useGetMediaTranscript } from "../../features/transcripts";
import type { TranscriptsMediaResponse } from "../../services/transcripts";
import { useState } from "react";
import { Collapse } from "antd";
export const Route = createFileRoute("/overview/$fileId")({
  component: OverviewComponent,
});

function OverviewComponent() {
  const { fileId } = Route.useParams();

  const { data: batch, isLoading, isError } = useGetBatch(parseInt(fileId));
  const [openTranscripts, setOpenTranscripts] = useState<
    Record<number, boolean>
  >({});

  const toggleTranscript = (mediaFileId: number) => {
    setOpenTranscripts(
      (prev: Record<number, boolean>): Record<number, boolean> => ({
        ...prev,
        [mediaFileId]: !prev[mediaFileId],
      })
    );
  };
  const trainId = batch?.trainId;
  const trainQuery = useGetTrain(trainId ?? 1);
  const train = trainQuery.data;

  const fileIds = batch?.files?.map((file) => file.id) ?? [];
  const fileQueries = useGetFileUrls(fileIds);

  const audioFileIds =
    batch?.files
      ?.filter((file) => {
        const ext = file.filename.split(".").pop()?.toLowerCase() || "";
        return FILE_TYPE_MAP[ext] === FileType.AUDIO;
      })
      .map((file) => file.id) ?? [];

  const transcriptQueries = useGetMediaTranscript(audioFileIds);

  if (isLoading || trainQuery.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError || !batch || trainQuery.isError || !train) {
    return <div>Ошибка загрузки</div>;
  }

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
      value: new Date(batch.trainDeparted).toLocaleDateString(),
    },
    {
      key: "trainArrived",
      label: "Дата прибытия поезда",
      value: new Date(batch.trainArrived).toLocaleDateString(),
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
        batch.chief.surname +
        " " +
        batch.chief.name +
        " " +
        batch.chief.patronymic,
    },
    {
      key: "uploadedBy",
      label: "Работник",
      value:
        batch.uploadedBy.surname +
        " " +
        batch.uploadedBy.name +
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

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-col p-10 pt-0 gap-8">
      <div className="flex flex-col pt-4">
        <Card title="Подробная информация о записи">
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
      <div className="flex flex-col">
        <UploadFileForm fileId={parseInt(fileId)} />
      </div>

      <Card title="Аудиозаписи с транскриптами">
        <Collapse accordion>
          {audioFileIds.map((mediaFileId, index) => {
            const file = batch.files.find((f) => f.id === mediaFileId);
            const transcriptQuery = transcriptQueries[index];

            if (transcriptQuery.isLoading) {
              return (
                <Collapse.Panel
                  header={file?.filename || "Загрузка..."}
                  key={mediaFileId}
                >
                  <p>Загрузка транскрипта...</p>
                </Collapse.Panel>
              );
            }

            if (transcriptQuery.isError) {
              return (
                <Collapse.Panel
                  header={file?.filename || "Ошибка"}
                  key={mediaFileId}
                >
                  <p className="text-red-500">Ошибка загрузки транскрипта</p>
                </Collapse.Panel>
              );
            }

            const url =
              fileQueries[batch.files.findIndex((f) => f.id === mediaFileId)]
                ?.data;
            const transcriptData = transcriptQuery.data;

            return (
              <Collapse.Panel
                header={
                  <div className="flex flex-col">
                    <span>{file?.filename}</span>
                    <small className="text-gray-500">
                      Нажмите, чтобы посмотреть транскрипт
                    </small>
                  </div>
                }
                key={mediaFileId}
              >
                <Row gutter={16} className="mb-4">
                  <Col xs={24}>
                    <audio key={url} controls style={{ width: "100%" }}>
                      <source src={url} type="audio/mpeg" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </Col>
                </Row>
                <Card size="small" title="Транскрипт">
                  <div className="space-y-2">
                    {transcriptData && transcriptData.length > 0 ? (
                      transcriptData.map(
                        (fragment: TranscriptsMediaResponse, i: number) => (
                          <div key={i} className="bg-gray-100 p-3 rounded">
                            <div className="font-bold">
                              {new Date(fragment.begin)
                                .toISOString()
                                .split("T")[1]
                                .slice(0, 8)}{" "}
                              —{" "}
                              {new Date(fragment.end)
                                .toISOString()
                                .split("T")[1]
                                .slice(0, 8)}
                            </div>
                            <div>{fragment.text}</div>
                          </div>
                        )
                      )
                    ) : (
                      <div>Нет транскрипта</div>
                    )}
                  </div>
                </Card>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Card>
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
                    </div>
                  </Col>
                );
              }

              return null;
            })}
          </Row>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Изображения</h3>
          <Row gutter={[24, 24]}>
            {fileQueries.map((query, index) => {
              const file = batch.files[index];
              const ext =
                file.filename.split(".").pop()?.toLowerCase() || "other";
              const fileType = FILE_TYPE_MAP[ext];

              if (query.isLoading) return null;
              if (query.isError) return null;

              if (fileType === FileType.IMAGE) {
                const url = query.data;
                return (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <div className="p-3 bg-white shadow rounded flex flex-col">
                      <img
                        src={url}
                        alt={file.filename}
                        className="w-full h-40 object-contain mb-2"
                      />
                      <span className="truncate">{file.filename}</span>
                      <Button
                        type="link"
                        onClick={() =>
                          downloadFile(url as string, file.filename)
                        }
                      >
                        Скачать
                      </Button>
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
                        download={file.filename}
                        // target="_blank"
                        // rel="noopener noreferrer"
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
