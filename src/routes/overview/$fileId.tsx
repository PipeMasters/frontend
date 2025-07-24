import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Table, Col, Row, Tag } from "antd";
import { useGetBatch } from "../../features/batch";
import { useGetTrain } from "../../features/train";
import { getCauseLabel } from "../../services/batch";
import { useGetFileUrls } from "../../features/file";
import { FILE_TYPE_MAP, FileType } from "../../services/file";
import UploadFileForm from "../../widgets/uploadFileForm";
import {
  useGetBatchTranscript,
  useGetMediaTranscript,
} from "../../features/transcripts";
import type { TranscriptsMediaResponse } from "../../services/transcripts";
import { Collapse } from "antd";
import { useEffect, useRef, useState } from "react";
import SearchInput from "../../widgets/searchInput";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
export const Route = createFileRoute("/overview/$fileId")({
  component: OverviewComponent,
});

function OverviewComponent() {
  const { fileId } = Route.useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const [activeSearchResults, setActiveSearchResults] = useState<{
    [key: number]: number[];
  }>({});
  const [highlightedText, setHighlightedText] = useState("");
  const fragmentsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { data: batch, isLoading, isError } = useGetBatch(parseInt(fileId));

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
  const batchTranscriptQuery = useGetBatchTranscript(
    parseInt(fileId),
    lastSearchQuery || ""
  );

  useEffect(() => {
    if (batchTranscriptQuery.data && lastSearchQuery) {
      const results: { [key: number]: number[] } = {};
      const fragments: { id: number; mediaFileId: number }[] = [];

      batchTranscriptQuery.data.forEach((item) => {
        results[item.mediafileId] = item.fragmentsIds;
        item.fragmentsIds.forEach((fragmentId) => {
          fragments.push({
            id: fragmentId,
            mediaFileId: item.mediafileId,
          });
        });
      });

      setActiveSearchResults(results);
      setHighlightedText(lastSearchQuery);
      setAllFoundFragments(fragments);
      setCurrentResultIndex(0);

      if (fragments.length > 0) {
        scrollToFragment(fragments[0].id, fragments[0].mediaFileId);
      }
    } else if (lastSearchQuery === null) {
      setActiveSearchResults({});
      setHighlightedText("");
      setAllFoundFragments([]);
      setCurrentResultIndex(0);
    }
  }, [batchTranscriptQuery.data, lastSearchQuery]);

  const scrollToFragment = (fragmentId: number, mediaFileId: number) => {
    const mediaIndex = audioFileIds.findIndex((id) => id === mediaFileId);
    if (mediaIndex !== -1 && transcriptQueries[mediaIndex].data) {
      const fragment = transcriptQueries[mediaIndex].data?.find(
        (f: TranscriptsMediaResponse) => f.id === fragmentId
      );

      if (fragment && fragmentsRef.current[fragment.id]) {
        fragmentsRef.current[fragment.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [allFoundFragments, setAllFoundFragments] = useState<
    {
      id: number;
      mediaFileId: number;
    }[]
  >([]);

  const handleNextResult = () => {
    if (currentResultIndex < allFoundFragments.length - 1) {
      const newIndex = currentResultIndex + 1;
      setCurrentResultIndex(newIndex);
      const fragment = allFoundFragments[newIndex];
      scrollToFragment(fragment.id, fragment.mediaFileId);
    }
  };

  const handlePrevResult = () => {
    if (currentResultIndex > 0) {
      const newIndex = currentResultIndex - 1;
      setCurrentResultIndex(newIndex);
      const fragment = allFoundFragments[newIndex];
      scrollToFragment(fragment.id, fragment.mediaFileId);
    }
  };

  const highlightText = (
    text: string,
    highlight: string,
    fragmentId: number,
    mediaFileId: number
  ) => {
    if (!highlight.trim()) return text;

    const isFoundFragment =
      activeSearchResults[mediaFileId]?.includes(fragmentId);

    if (!isFoundFragment) {
      return text;
    }

    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setLastSearchQuery(trimmedQuery);
    } else {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLastSearchQuery(null);
  };

  if (isLoading || trainQuery.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError || !batch || trainQuery.isError || !train) {
    return <div>Ошибка загрузки</div>;
  }

  const tableData = [
    {
      key: "id",
      label: "Номер видеозаписи",
      value: `№ ${batch.id}`,
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
      {allFoundFragments.length > 0 && (
        <div className="fixed right-8 bottom-8 flex flex-col gap-2 z-50 items-center">
          <Button
            type="primary"
            icon={<ArrowUpOutlined />}
            onClick={currentResultIndex <= 0 ? undefined : handlePrevResult}
            style={{
              backgroundColor: currentResultIndex <= 0 ? "#e5e7eb" : "#1677ff",
              color: currentResultIndex <= 0 ? "#888" : "#fff",
              borderColor: currentResultIndex <= 0 ? "#e5e7eb" : "#1677ff",
              opacity: currentResultIndex <= 0 ? 0.8 : 1,
              pointerEvents: currentResultIndex <= 0 ? "none" : "auto",
            }}
          />
          <Button
            type="primary"
            icon={<ArrowDownOutlined />}
            onClick={
              currentResultIndex >= allFoundFragments.length - 1
                ? undefined
                : handleNextResult
            }
            style={{
              backgroundColor:
                currentResultIndex >= allFoundFragments.length - 1
                  ? "#e5e7eb"
                  : "#1677ff",
              color:
                currentResultIndex >= allFoundFragments.length - 1
                  ? "#888"
                  : "#fff",
              borderColor:
                currentResultIndex >= allFoundFragments.length - 1
                  ? "#e5e7eb"
                  : "#1677ff",
              opacity:
                currentResultIndex >= allFoundFragments.length - 1 ? 0.5 : 1,
              pointerEvents:
                currentResultIndex >= allFoundFragments.length - 1
                  ? "none"
                  : "auto",
            }}
          />
          <Button
            type="primary"
            disabled
            style={{
              cursor: "default",
              backgroundColor: "#1677ff",
              color: "#fff",
            }}
          >
            {`${currentResultIndex + 1}/${allFoundFragments.length}`}
          </Button>
        </div>
      )}
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

      <Card
        title="Текст коммуникаций"
        extra={
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isFetching={batchTranscriptQuery.isFetching}
            clearSearch={clearSearch}
          />
        }
      >
        <Collapse accordion>
          {audioFileIds.map((mediaFileId, index) => {
            const audioFile = batch.files.find((f) => f.id === mediaFileId);

            const linkedVideoFile = audioFile?.source
              ? batch.files.find((f) => f.id === audioFile.source.id)
              : null;

            const transcriptQuery = transcriptQueries[index];
            const isSearchActive = activeSearchResults[mediaFileId]?.length > 0;

            if (transcriptQuery.isLoading) {
              return (
                <Collapse.Panel
                  header={audioFile?.filename || "Загрузка..."}
                  key={mediaFileId}
                >
                  <p>Загрузка текста коммуникаций...</p>
                </Collapse.Panel>
              );
            }
            if (transcriptQuery.isError) {
              return (
                <Collapse.Panel
                  header={audioFile?.filename || "Ошибка"}
                  key={mediaFileId}
                >
                  <p className="text-red-500">Ошибка загрузки текста коммуникаций</p>
                </Collapse.Panel>
              );
            }

            const audioUrlQuery =
              fileQueries[batch.files.findIndex((f) => f.id === mediaFileId)];
            const audioUrl = audioUrlQuery?.data;

            let videoUrl = null;
            let videoUrlQuery = null;
            if (linkedVideoFile) {
              const videoIndex = batch.files.findIndex(
                (f) => f.id === linkedVideoFile.id
              );
              if (videoIndex !== -1) {
                videoUrlQuery = fileQueries[videoIndex];
                videoUrl = videoUrlQuery?.data;
              }
            }

            const transcriptData = transcriptQuery.data;

            return (
              <Collapse.Panel
                header={
                  <div className="flex flex-col ">
                    <span className="truncate max-w-lg">
                      {audioFile?.filename?.replace(/\.[^/.]+$/, "")}{" "}
                      {isSearchActive && (
                        <Tag color="green" className="!ml-2">
                          Найдено: {activeSearchResults[mediaFileId]?.length}
                        </Tag>
                      )}
                    </span>
                    <small className="text-gray-500 text-xs">
                      Нажмите, чтобы посмотреть текст коммуникаций
                    </small>
                  </div>
                }
                key={mediaFileId}
              >
                {linkedVideoFile && videoUrl && (
                  <Row gutter={16} className="mb-4">
                    <Col xs={24} className="flex justify-center">
                      <video
                        key={videoUrl}
                        controls
                        preload="auto"
                        playsInline
                        className="w-3/5 h-auto mx-auto rounded-lg"
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                      </video>
                    </Col>
                  </Row>
                )}

                <Row gutter={16} className="mb-4">
                  <Col xs={24}>
                    <audio key={audioUrl} controls style={{ width: "100%" }}>
                      <source src={audioUrl} type="audio/mpeg" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </Col>
                </Row>

                <Card
                  size="small"
                  title="Транскрипт"
                  className="max-h-96 overflow-y-auto"
                >
                  <div className="space-y-2 text-sm">
                    {transcriptData && transcriptData.length > 0 ? (
                      transcriptData.map(
                        (fragment: TranscriptsMediaResponse) => {
                          const isHighlighted = activeSearchResults[
                            mediaFileId
                          ]?.includes(fragment.id);
                          return (
                            <div
                              key={fragment.id}
                              ref={(el) => {
                                fragmentsRef.current[fragment.id] = el;
                              }}
                              className={`p-2 rounded text-xs ${
                                isHighlighted
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div className="font-bold text-xs">
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
                              <div className="mt-1">
                                {highlightedText
                                  ? highlightText(
                                      fragment.text,
                                      highlightedText,
                                      fragment.id,
                                      mediaFileId
                                    )
                                  : fragment.text}
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="text-xs">Нет текста коммуникаций</div>
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
          <h3 className="text-md font-semibold mb-2">Изображения</h3>
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
                      <span className="max-w-full truncate">{file.filename}</span>
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
          <h3 className="text-md font-semibold mb-2">Документы</h3>
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
                      <span className="truncate max-w-full text-center">📄 {file.filename}</span>
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
