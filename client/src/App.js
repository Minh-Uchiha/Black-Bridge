import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CanvasProvider } from "./context/CanvasContext";
import { SocketProvider } from "./context/SocketContext";
import { MainPage } from "./components";

function App() {
  return (
    <CanvasProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/*" element={<MainPage />} />
          </Routes>
        </Router>
      </SocketProvider>
    </CanvasProvider>
  );
}

export default App;
