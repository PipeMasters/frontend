import { useBatchVideo } from "../features/batch";
import { List } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";

export default function BatchVideo() {
  const { data } = useBatchVideo();

  return (
    <div className="max-w-7xl mx-auto">
      <List
        dataSource={data}
        renderItem={(video) => (
          <List.Item
            key={video?.id}
            className="border border-gray-300 p-2 mb-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <VideoCameraOutlined className="text-gray-600 mr-2" style={{ fontSize: 22 }} />
              <span className="text-lg">
                Видеозапись от {video.dateDeparted}-{" "}
                {video.dateArrived}, поезд {video.trainNumber}, начальник поезда {video.chiefName}
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
