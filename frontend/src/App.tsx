import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { MainApp } from "./pages/MainApp";
import { SectionsPage } from "./pages/SectionsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/courses/:courseId/sections"
          element={
            <AppShell>
              <SectionsPage />
            </AppShell>
          }
        />
        <Route
          path="/*"
          element={
            <AppShell>
              <MainApp />
            </AppShell>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
