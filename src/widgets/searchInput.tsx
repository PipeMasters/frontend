import { type FC } from "react";
import { Input } from "antd";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: () => void;
  isFetching: boolean;
  clearSearch: () => void;
}

const SearchInput: FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isFetching,
  clearSearch,
}) => (
  <div className="max-w-full">
    <Input.Search
      placeholder="Поиск по тексту коммуникаций"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onSearch={handleSearch}
      enterButton="Искать"
      loading={isFetching}
      size="large"
      allowClear
      onClear={clearSearch}
      
    />
  </div>
);

export default SearchInput;
