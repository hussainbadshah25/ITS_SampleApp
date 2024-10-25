import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Popconfirm,
  message,
  Space,
  Input,
  Row,
  Col,
  Form,
  Input as AntInput,
  Switch,
} from "antd";
import {
  EyeOutlined,
  UserAddOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../../Services/AxiosInstance";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [addUserForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/AllUsers");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/user/deleteUser`, { data: { userId } });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAdding(true);
    setModalVisible(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsAdding(false);
    setModalVisible(true);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    const filteredData = users.filter((item) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredUsers(filteredData);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    addUserForm.resetFields();
  };

  const handleAddUserSubmit = async (values) => {
    setLoading(true);
    if (values.is_admin === undefined) {
      values.is_admin = false;
    }
    try {
      const response = await axiosInstance.post("/user/addUser", {
        values,
      });
      message.success("User added successfully");
      setModalVisible(false);
      addUserForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error("Failed to Add users");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "UserID",
    },
    {
      title: "ITS No",
      dataIndex: "its_id",
      key: "ITSNo",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "is Admin",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (is_admin) => (is_admin ? "Yes" : "No"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input
              placeholder="Search User"
              value={searchText}
              onChange={handleSearch}
              style={{ width: 200 }}
            />
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />

        {/* Modal for Adding and Viewing User */}
        <Modal
          title={isAdding ? "Add User" : "User Information"}
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          {isAdding ? (
            <Form
              form={addUserForm}
              layout="vertical"
              onFinish={handleAddUserSubmit}
            >
              <Form.Item
                label="ITS ID"
                name="its_id"
                rules={[{ required: true, message: "Please input ITS ID!" }]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input Password!" }]}
              >
                <AntInput.Password />
              </Form.Item>
              <Form.Item
                label="Name"
                name="username"
                rules={[{ required: true, message: "Please input Name!" }]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item
                label="Is Admin"
                name="is_admin"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ) : (
            selectedUser && (
              <div>
                <p>
                  <strong>ITS ID:</strong> {selectedUser.its_id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Age:</strong>
                  {selectedUser.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedUser.gender}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedUser.mobile}
                </p>
                <p>
                  <strong>email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Marital Status:</strong>
                  {selectedUser.marital_status}
                </p>
                <p>
                  <strong>Address:</strong> {selectedUser.address}
                </p>
                <p>
                  <strong>Country Name:</strong>
                  {selectedUser.Country_Name}
                </p>
                <p>
                  <strong>City Name:</strong> {selectedUser.City_Name}
                </p>
                <p>
                  <strong>Hobbies:</strong>{" "}
                  {selectedUser.hobbies &&
                    selectedUser.hobbies.map((hobby, index) => (
                      <span key={index}>
                        {hobby}
                        {index < selectedUser.hobbies.length - 1 && ", "}
                      </span>
                    ))}
                </p>
              </div>
            )
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default UserList;
