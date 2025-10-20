export interface InterfaceRow {
  id: string;
  interfaceType: string;
  startPort: number;
  endPort: number;
  prefix: string;
  runningNumber: number;
}

export interface InterfaceRowsProps {
  rows: InterfaceRow[];
  onChange: (rows: InterfaceRow[]) => void;
  interfaceTypeOptions?: Array<{ value: string; label: string }>;
}
