import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

// Define the full list of topics you want to display
const ALL_TOPICS = [
  "Array",
  "String",
  "Math",
  "DP",
  "Graph",
  "Greedy",
  "Tree",
  "Binary Search",
  "Heap",
  "Stack",
];

const TopicBarChart = ({ data }) => {
  // Normalize the input `data` so that all topics are included with fallback to 0
  const chartData = ALL_TOPICS.map((topic) => ({
    name: topic,
    count: data[topic] ? data[topic].length : 0,
  }));

  return (
    <div>
      <h2>Problems by Topic</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default TopicBarChart;