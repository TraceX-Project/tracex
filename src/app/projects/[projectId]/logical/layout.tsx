import { ReactFlowProvider } from '@xyflow/react';

type Props = {
  children: React.ReactNode;
};

export default function LogicalLayout({ children }: Props) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
