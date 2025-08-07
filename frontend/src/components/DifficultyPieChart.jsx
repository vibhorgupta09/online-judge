

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["rgb(130, 202, 157)", "#ffb700", "#f63737"];
const EMPTY_COLORS = ["#d3d3d3", "#c0c0c0", "#a9a9a9"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const DifficultyPieChart = ({ data }) => {
  const chartData = DIFFICULTIES.map((difficulty) => ({
    name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    value: data[difficulty] ? data[difficulty].length : 0,
  }));

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const isEmpty = total === 0;

  const displayData = isEmpty
    ? DIFFICULTIES.map((difficulty) => ({
        name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        value: 1, // Show equal dummy segments
      }))
    : chartData;

  return (
    <div>
      <PieChart width={400} height={300}>
        <Pie
          data={displayData}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {displayData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                isEmpty
                  ? EMPTY_COLORS[index % EMPTY_COLORS.length]
                  : COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      {isEmpty && (
        <p style={{ color: "#999", fontStyle: "italic", textAlign: "center" }}>
          No problems solved yet.
        </p>
      )}
    </div>
  );
};

export default DifficultyPieChart;