import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const DifficultyPieChart = ({ data }) => {
  const chartData = DIFFICULTIES.map((difficulty, index) => ({
    name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), // Capitalize
    value: data[difficulty] ? data[difficulty].length : 0,
  }));

  return (
    <div>
      <h2>Problems by Difficulty</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default DifficultyPieChart;