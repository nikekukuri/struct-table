"use client";

import { AppNavBar } from "../components/AppNavbar";
import { Graph } from "../components/GraphView";

const GraphView: React.FC = () => {
  return (
    <>
      <AppNavBar />
      <div className="flex space-x-4">
        <div className="bg-white p-4 border border-gray-300 rounded">
          <Graph />
        </div>
        <div className="bg-white p-4 border border-gray-300 rounded">
          <Graph />
        </div>
      </div>
    </>
  );
};

export default GraphView;
