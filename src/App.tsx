import NavAnchor from "./components/NavAnchor/NavAnchor";
import EditorPage from "./pages/EditorPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import lemonLogo from "./assets/lemon.svg";

function App() {
  return (
    <Router basename={window.location.pathname.replace(/(\/[^/]*)$/, "")}>
      <main>
        <nav className="flex bg-gray-800 p-3 gap-6 items-center">
          <div className="flex gap-2 items-center">
            <img
              src={lemonLogo}
              className="rounded-sm h-8 w-auto"
              alt=""
              draggable="false"
            />
            <span className="font-mono text-yellow-400 font-bold">
              LemonTracker
            </span>
          </div>
          <div className="flex gap-4 text-slate-300 font-mono text-sm">
            <NavAnchor href="/">Module Editor</NavAnchor>
            <NavAnchor href="/#">Explorer</NavAnchor>
          </div>
        </nav>
        <div className="p-4 text-slate-200">
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
