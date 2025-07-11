import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DatePicker, Pagination } from "antd";

import ModalButton from "../widgets/modalButton";
import BatchVideo from "../widgets/batchVideo";
import FilterCard from "../widgets/filterCard";
import type {BatchQueryParams} from "../services/batch";
import { useBatches } from "../features/batch/useBatches";

const { RangePicker } = DatePicker;

export const Route = createFileRoute("/")({
  component: RouteComponent,
});


function RouteComponent() {
  const [filterParams, setFilterParams] = useState<BatchQueryParams>({
    page: 0,
    size: 10,
  });

  const { data: batch } = useBatches(filterParams);

  const handleFilter = (params: BatchQueryParams) => {
    setFilterParams((prev) => ({
      ...params,
      page: 0,
      size: prev.size,
    }));
  };

  const onPageChange = (page: number, pageSize?: number) => {
    setFilterParams((prev) => ({
      ...prev,
      page: page - 1,
      size: pageSize ?? prev.size,
    }));
  };

  return (
    <div className="flex p-4 gap-10">
      <div className="flex flex-col w-72 space-y-4">
        <FilterCard onFilter={handleFilter} />
        <ModalButton buttonText="Добавить поезд" type="train" />
        <ModalButton buttonText="Добавить филиал" type="branch" />
        <ModalButton buttonText="Добавить запись" type="batch" />
      </div>

      <div className="flex-1">
        <BatchVideo data={batch?.content ?? []} />

        <Pagination
          current={(filterParams.page ?? 0) + 1}
          pageSize={filterParams.size}
          total={batch?.totalElements ?? 0}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={onPageChange}
          onShowSizeChange={onPageChange}
          style={{ marginTop: 16, textAlign: "center" }}
        />
      </div>
    </div>
  );
}
