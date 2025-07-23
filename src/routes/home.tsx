import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pagination, Card, Button } from "antd";
import BatchVideo from "../widgets/batchVideo";
import FilterCard from "../widgets/filterCard";
import ModalDropdownButton from "../widgets/modalButton";
import { useBatches } from "../features/batch/useBatches";
import { useGetTranscript } from "../features/transcripts/useGetTranscript";
import { useFilterState, useFilterActions } from "../store/filterStore";
import SearchInput from "../widgets/searchInput";
import SearchResults from "../widgets/searchResults";
import ImotioSwitch from "../widgets/imotioSwitch";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const filterParams = useFilterState();
  const { setFilters } = useFilterActions();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);

  const {
    data: searchResults,
    refetch: refetchSearch,
    isFetching,
  } = useGetTranscript(lastSearchQuery || "");

  const { data: allBatches } = useBatches(filterParams);

  const filteredBatches = useMemo(() => {
    if (!searchResults || !allBatches?.content) return [];
    const matchingBatchIds = new Set(searchResults.map((result) => result.id));
    return allBatches.content.filter((batch) => matchingBatchIds.has(batch.id));
  }, [searchResults, allBatches]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setLastSearchQuery(trimmedQuery);
      // refetchSearch();
      // clearSearch();
    } else if (trimmedQuery === "") {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLastSearchQuery(null);
  };

  const onPageChange = (page: number, pageSize?: number) => {
    setFilters({
      ...filterParams,
      page: page - 1,
      size: pageSize ?? filterParams.size,
    });
  };

  const showSearchResults = lastSearchQuery !== null && searchResults;
  const showNoResults = lastSearchQuery !== null && searchResults?.length === 0;
  const showRegularBatches = lastSearchQuery === null;

  useEffect(() => {
    if (lastSearchQuery !== null) {
      refetchSearch();
    }
  }, [lastSearchQuery, refetchSearch]);

  return (
    <div className="flex p-4 gap-10">
      <div className="flex flex-col w-72 space-y-4">
        <FilterCard onFilter={setFilters} />
        <ModalDropdownButton />
        <Button type="default" onClick={() => navigate({ to: "/" })}>
          Метрики
        </Button>
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="flex-1">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isFetching={isFetching}
              clearSearch={clearSearch}
            />
          </div>
          <ImotioSwitch />  
        </div>
        {showSearchResults && searchResults.length > 0 ? (
          <SearchResults
            searchResults={searchResults}
            filteredBatches={filteredBatches}
          />
        ) : showNoResults ? (
          <Card>
            <p>По вашему запросу ничего не найдено.</p>
          </Card>
        ) : showRegularBatches ? (
          <>
            <BatchVideo data={allBatches?.content ?? []} />
            <div className="flex justify-center mt-4">
              <Pagination
                current={(filterParams.page ?? 0) + 1}
                pageSize={filterParams.size}
                total={allBatches?.totalElements ?? 0}
                showSizeChanger
                pageSizeOptions={["5", "10", "20", "50"]}
                onChange={onPageChange}
                onShowSizeChange={onPageChange}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
