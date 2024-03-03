export default function Command({ children }: { children: React.ReactNode }) {
  return (
    <code className="ml-6 inline-flex items-center bg-black p-2 text-sm font-bold">
      <pre>{children}</pre>
    </code>
  );
}
