import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const InfectionFractalChart = ({
  data,
  stepInterval = 50,
}: {
  data: number[];
  stepInterval?: number;
}) => {
  const filteredData = data
    .map((value, index) => ({ step: index, dimension: value }))
    .filter(
      (entry, index) => index % stepInterval === 0 || index === data.length - 1
    );

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="step"
            label={{
              value: "Passo da Simulação",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: "Dimensão Fractal",
              angle: -90,
              position: "insideLeft",
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => [
              Number(value).toFixed(3),
              "Dimensão Fractal",
            ]}
            labelFormatter={(label) => `Passo: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="dimension"
            stroke="#8884d8"
            activeDot={{ r: 6 }}
            name="Dimensão Fractal"
            dot={filteredData.length < 30}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
