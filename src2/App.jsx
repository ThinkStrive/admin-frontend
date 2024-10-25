// Other resources
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Css
import "./App.css";

// JSX Components
import ProtectedPage from "./ProtectedPage";
import Home from "./Pages/Layout/Home";
import Toast from "./Components/Resources/Toast";
import Auth from "./Pages/Auth/Auth";
import { ThemeProvider } from "./Components/Store/ThemeContext";

function App() {
  const google_auth_client_id = import.meta.env.GOOGLE_AUTH_CLIENT_ID || "";
  return (
    <>
      {/* <GoogleOAuthProvider clientId=""> */}
        <Toast>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth/*" element={<Auth />} />
                {/* Protected Page URL */}
                <Route path="/*" element={<ProtectedPage element={<Home />} />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </Toast>
      {/* </GoogleOAuthProvider> */}
    </>
  );
}

export default App;
