import { useBatchVideo } from "../features/batch";
import { List } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";

export default function BatchVideo() {
  const { data } = useBatchVideo();

  return (
    <div className="max-w-7xl mx-auto">
      <List
        dataSource={data}
        renderItem={(video) => (
          <Link
            to="/overview/$fileId"
            params={{ fileId: video?.id.toString() }}
          >
            <List.Item
              key={video?.id}
              className="border border-gray-300 p-2 mb-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex items-center pl-2">
                <VideoCameraOutlined
                  className="text-gray-600 mr-2"
                  style={{ fontSize: 22 }}
                />
                <span className="text-lg">
                  Видеозапись от {video.dateDeparted}- {video.dateArrived},
                  поезд {video.trainNumber}, начальник поезда {video.chiefName}
                </span>
              </div>
            </List.Item>
          </Link>
        )}
      />
    </div>
  );
}
