import { useQuery, useQueryClient } from "react-query";
import useWebSocket from "react-use-websocket";
import { Route, Routes } from "react-router-dom";

import axios, { AxiosError } from "axios";

import "./App.css";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import { get_user } from "./services/users";
import OtherProfile from "./pages/OtherProfile";
import { wshost } from "./config/config";
import { useEffect } from "react";

function App() {
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket(wshost);

  useEffect(() => {
    if (lastMessage?.data) {
      queryClient.invalidateQueries("other_user");
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("post");
    }
  }, [lastMessage]);

  const _ = useQuery("user", get_user, {
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          localStorage.setItem("token", "");
          axios.defaults.headers.common = {
            Authorization: ``,
          };
        }
      }
    },
    retry: (failureCount, error) => {
      if (
        error instanceof AxiosError &&
        (error.response?.status === 400 || error.response?.status === 401)
      ) {
        return false;
      }
      return true;
    },
  });
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<OtherProfile />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
