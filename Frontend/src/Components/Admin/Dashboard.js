// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  DatePicker,
  Spin,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 2,
    activeUsers: 2,
    totalCountries: 1,
    totalCities: 1,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get("/api/admin/stats", {
          params: {
            startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
            endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
          },
        }),
        axios.get("/api/admin/recent-activity"),
      ]);

      setStats(statsRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activityColumns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Activity",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={stats.activeUsers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Countries"
                value={stats.totalCountries}
                prefix={<GlobalOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Cities"
                value={stats.totalCities}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Recent Activity"
          extra={
            <RangePicker onChange={(dates) => setDateRange(dates)} allowClear />
          }
        >
          <Table
            columns={activityColumns}
            dataSource={recentActivity}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Space>
    </Spin>
  );
};

export default Dashboard;
