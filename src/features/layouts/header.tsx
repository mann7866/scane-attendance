export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Sidebar Button Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-slate-600"
        >
          <span className="material-icons-outlined">menu</span>
        </button>

        {/* Logo / Title */}
        <span className="font-bold text-lg text-slate-800">
          BKK Admin
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <button className="relative p-2 text-slate-400 hover:text-primary">
          <span className="material-icons-outlined">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

      </div>
    </header>
  );
}
