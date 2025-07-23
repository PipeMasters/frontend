import { Switch, Tooltip } from "antd";
import { useGetImotioStatus, useSetImotioStatus } from "../features/imotio";

export default function ImotioSwitch() {
  const { data: imotioStatus, isLoading: imotioLoading } = useGetImotioStatus();
  const setImotioMutation = useSetImotioStatus();

  const label = imotioStatus ? "Imotio включён" : "Imotio выключен";
  const color = imotioStatus ? "text-green-700" : "text-red-700";

  const handleToggle = (checked: boolean) => {
    setImotioMutation.mutate(checked);
  };

  return (
    <div className="flex gap-2 px-3 py-2 bg-gray-100 rounded-lg min-w-fit">
      <Tooltip title="Включить или выключить отправку файлов в Imotio">
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </Tooltip>
      <Switch
        loading={imotioLoading || setImotioMutation.isPending}
        checked={imotioStatus === true}
        onChange={handleToggle}
      />
    </div>
  );
}
