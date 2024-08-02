import React, { useState } from "react";

interface CollapsibleProps {
  text: string;
  maxLength: number;
}

const Collapsible: React.FC<CollapsibleProps> = ({ text, maxLength }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderText = () => {
    if (isCollapsed) {
      return text.length > 180 ? text.substring(0, 180) + "..." : text;
    }
    return text;
  };

  return (
    <div>
      <p>{renderText()}</p>
      {text.length > maxLength && (
        <button onClick={toggleCollapse}>
          {isCollapsed ? "Show More" : "Show Less"}
        </button>
      )}
    </div>
  );
};

export default Collapsible;
