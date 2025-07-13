import { List } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import type {BatchVideo } from "../services/batch";
import dayjs from "dayjs";

function formatDate(date: string | undefined) {
  return date ? dayjs(date).format("DD.MM.YYYY") : "";
}

export default function BatchVideo({ data }: { data: BatchVideo[] }) {
  return (
    <div className="max-w-7xl mx-auto">
      <List
        dataSource={data}
        renderItem={(video) => (
          <Link
            to="/overview/$fileId"
            params={{ fileId: video?.id.toString() }}
            className="block border border-gray-300 p-3 mb-2 cursor-pointer transition-shadow duration-200 hover:shadow-lg hover:border-grey-400 !text-black"
            key={video?.id}
          >
            <div className="flex items-center pl-2">
              <VideoCameraOutlined
                className="text-gray-600 mr-2"
                style={{ fontSize: 22 }}
              />
              <span className="text-lg">
                Видеозапись № {video.id} от {formatDate(video.dateDeparted)} — {formatDate(video.dateArrived)}, поезд{" "}
                {video.trainNumber}, начальник {video.chiefName}
              </span>
            </div>
          </Link>
        )}
      />
    </div>
  );
}
