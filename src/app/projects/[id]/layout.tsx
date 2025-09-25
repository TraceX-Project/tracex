type Props = {
  children: React.ReactNode;
};

export default async function LogicalViewLayout({ children }: Props) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex h-full flex-col">{children}</div>
    </div>
  );
}
