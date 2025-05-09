export const ELEMENT_STYLE = [
  {
    selector: "node",
    style: {
      shape: "rectangle", // Set shape to rectangle (square when width equals height)
      "border-width": "2px",
      "border-color": "gray",
      "border-cap": "round",
      width: "200px", // Set width of the node
      height: "100px", // Set height of the node
      "background-color": "#6FB1FC",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "14px",
      color: "#ffffff",
      "text-wrap": "wrap", // Allow text to wrap within the node
      "text-max-width": "80px", // Set maximum width for text wrapping
    },
  },
  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "4px",
      "border-color": "#FF5733",
      "background-color": "#FFB6C1",
      "text-outline-color": "#FF5733",
    },
  },
];
