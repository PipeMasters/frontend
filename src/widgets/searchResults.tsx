import { type FC } from "react";
import { List, Card, Button, Tag } from "antd";
import type { TranscriptsSearchResponse } from "../services/transcripts";

interface SearchResultsProps {
  searchResults: TranscriptsSearchResponse[];
}
const SearchResults: FC<SearchResultsProps> = ({
  searchResults,
}) => {
    const batchesToRender = searchResults.map((result) => ({
    id: result.id,
    dateDeparted: result.dateDeparted,
    dateArrived: result.dateArrived,
    trainNumber: result.trainNumber,
    chiefName: result.chiefName,
    branchName: result.branchName,
  }));

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Найдено в {searchResults.length}{" "}
        {searchResults.length === 1 ? "записи" : "записях"}
      </h2>
      <List
        dataSource={batchesToRender}
        renderItem={(batch) => {
          const result = searchResults.find((r) => r.id === batch.id);
          const totalCount: number =
            result?.files.reduce(
              (acc: number, f: { fragmentsIds: number[] }) =>
                acc + f.fragmentsIds.length,
              0
            ) || 0;

          return (
            <List.Item key={batch.id}>
              <Card className="w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">Запись №{batch.id}</h3>
                    <p>Поезд №{batch.trainNumber}</p>
                    <p>Филиал: {batch.branchName}</p>
                    <p>Начальник: {batch.chiefName}</p>
                    <p>
                      Отправлен:{" "}
                      {new Date(batch.dateDeparted).toLocaleDateString()}
                    </p>
                    <p>
                      Прибыл: {new Date(batch.dateArrived).toLocaleDateString()}
                    </p>
                    <Tag color="red">Совпадений: {totalCount}</Tag>
                  </div>
                  <Button
                    type="primary"
                    className="!bg-red-600 !text-white !border-none"
                    href={`/overview/${batch.id}`}
                    target="_blank"
                  >
                    Перейти
                  </Button>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default SearchResults;
