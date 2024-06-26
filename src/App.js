import { Route, Routes, useNavigate } from "react-router-dom";
import AuthBody from "./Components/Auth/AuthBody";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "./Reducers/Auth";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();

  useEffect(() => {
    const currDate = new Date(Date.now());
    if (!auth.remember && currDate.getTime() >= auth.remember_token){
      dispatch(logout());
      navigate('/auth')
    }
    Object.keys(theme.colors).forEach((x) =>
      document.documentElement.style.setProperty(x, theme.colors[x])
    );
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/auth" element={<AuthBody />} />
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
      {/* Sweet Alerts */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
