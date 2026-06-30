import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-raisin pt-24">
      <Navbar />
      {children}
    </div>
  );
}
