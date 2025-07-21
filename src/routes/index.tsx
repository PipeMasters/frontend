import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pagination } from "antd";
import BatchVideo from "../widgets/batchVideo";
import FilterCard from "../widgets/filterCard";
import type { BatchQueryParams } from "../services/batch";
import { useBatches } from "../features/batch/useBatches";
import ModalDropdownButton from "../widgets/modalButton";
import { useFilterActions, useFilterState } from "../store/filterStore";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const filterParams = useFilterState();
  const { setFilters } = useFilterActions();

  const { data: batch } = useBatches(filterParams);

  const handleFilter = (params: BatchQueryParams) => {
    setFilters({
      ...params,
      page: 0,
      size: filterParams.size,
    });
  };

  const onPageChange = (page: number, pageSize: number) => {
    setFilters({
      ...filterParams,
      page: page - 1,
      size: pageSize,
    });
  };

  return (
    <div className="flex p-4 gap-10">
      <div className="flex flex-col w-72 space-y-4">
        <FilterCard onFilter={handleFilter} />
        <ModalDropdownButton />
      </div>

      <div className="flex-1">
        <BatchVideo data={batch?.content ?? []} />

        <div className="flex justify-center mt-4">
          <Pagination
            current={(filterParams.page ?? 0) + 1}
            pageSize={filterParams.size}
            total={batch?.totalElements ?? 0}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            onChange={onPageChange}
            onShowSizeChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
