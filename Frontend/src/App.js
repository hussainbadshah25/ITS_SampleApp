import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import RouteManager from "./Routes/routeManager";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <RouteManager />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
