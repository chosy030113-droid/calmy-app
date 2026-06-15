import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
