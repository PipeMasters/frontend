import React from "react";
import { Card, Select, Spin, Typography, Row, Col } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { useMetrics } from "../features/metrics";

const { Option } = Select;
const { Title } = Typography;

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
];

export default function MetricsDashboard() {
  const [period, setPeriod] = React.useState<"week" | "month" | "year">("week");
  const { data, isLoading } = useMetrics(period);

  const handleChange = (value: "week" | "month" | "year") => {
    setPeriod(value);
  };

  if (isLoading || !data) return <Spin />;

  const uploadsData = Object.entries(data.uploadsByBranch).map(
    ([branch, count]) => ({ name: branch, value: count })
  );

  const MAX_CHANGE = 100;

  const percentChangeData = Object.entries(data.percentChangeByBranch).map(
    ([branch, change]) => {
      let value = Math.round(change * 100);
      if (value > MAX_CHANGE) value = MAX_CHANGE;
      if (value < -MAX_CHANGE) value = -MAX_CHANGE;

      return {
        name: branch,
        value,
        fill: value >= 0 ? "#82ca9d" : "#f67280",
      };
    }
  );

  const comparisonData = [
    {
      name: "Объём",
      current: Number((data.currentPeriodStorage / 1024 ** 2).toFixed(2)),
      previous: Number((data.previousPeriodStorage / 1024 ** 2).toFixed(2)),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <Row justify="space-between" align="middle">
        <Title level={3}>Метрики загрузок</Title>
        <Select defaultValue={period} onChange={handleChange}>
          <Option value="week">Неделя</Option>
          <Option value="month">Месяц</Option>
          <Option value="year">Год</Option>
        </Select>
      </Row>
      
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Общий объём">
            <p style={{ fontSize: 24, fontWeight: 600, color: "#52c41a" }}>
              {(data.totalStorage / 1024 ** 2).toFixed(2)} MB
            </p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Загрузки по филиалам">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={uploadsData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : "0"}%`
                  }
                >
                  {uploadsData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Изменение загрузок по филиалам (%)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={percentChangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value">
                  {percentChangeData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value) => `${value}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

    
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Текущий период vs Предыдущий период">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" MB" />
                <Legend />
                <RechartsTooltip formatter={(value) => `${value} MB`} />
                <Bar
                  dataKey="previous"
                  fill="#8884d8"
                  name="Предыдущий период"
                />
                <Bar dataKey="current" fill="#82ca9d" name="Текущий период" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
