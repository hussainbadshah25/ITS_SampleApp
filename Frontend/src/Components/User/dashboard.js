// src/components/admin/Dashboard.jsx
import React from "react";
import { Row, Space } from "antd";

const UserDashboard = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={16}>
        <h1>Welcome User to ITS Application</h1>
      </Row>
    </Space>
  );
};

export default UserDashboard;
