export type Flow = {
  from: string;
  to: string;
  volume: "High" | "Medium" | "Low";
};

export const flows: Flow[] = [
  { from: "India", to: "Singapore", volume: "High" },
  { from: "India", to: "United Kingdom", volume: "High" },
  { from: "Singapore", to: "United Kingdom", volume: "High" },
  { from: "Singapore", to: "Australia", volume: "Medium" },
  { from: "United Kingdom", to: "Germany", volume: "High" },
  { from: "United Kingdom", to: "France", volume: "High" },
  { from: "Germany", to: "France", volume: "High" },
  { from: "Switzerland", to: "Germany", volume: "Medium" },
  { from: "Switzerland", to: "France", volume: "Medium" },
  { from: "United Arab Emirates", to: "United Kingdom", volume: "Medium" },
  { from: "Cayman Islands", to: "United Kingdom", volume: "Low" },
  { from: "China", to: "Singapore", volume: "Medium" },
  { from: "Japan", to: "Singapore", volume: "Medium" },
  { from: "Canada", to: "United Kingdom", volume: "Medium" },
  { from: "Bermuda", to: "United Kingdom", volume: "Low" },
];