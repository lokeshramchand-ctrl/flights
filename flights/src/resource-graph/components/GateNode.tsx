import React from "react";

const GateNode = ({ data }: { data: any }) => {
  return (
    <div className="gate-node">
      <span>{data.name}</span>
    </div>
  );
};

export default GateNode;