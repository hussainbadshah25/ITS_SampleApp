import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  Card,
  Button,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../Services/AxiosInstance";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const PersonalInfoForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [hobbies, setHobbies] = useState([]);

  const decodedToken = jwtDecode(localStorage.getItem("token"));
  const userId = decodedToken.id;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [countriesRes, hobbiesRes] = await Promise.all([
        axiosInstance.get("/master/countries"),
        axiosInstance.get("/master/hobbies"),
      ]);

      setCountries(countriesRes.data.data.results || []);
      setHobbies(hobbiesRes.data.data.results || []);

      const userProfile = await axiosInstance.get(
        `/user/ProfileDetails/${userId}`
      );

      const getCities = await axiosInstance.get(
        `/master/cities/by-country/${userProfile.data.country_id}`
      );
      setCities(getCities.data.data.results || []);
      const userData = userProfile.data;
      form.setFieldsValue({
        ...userData,
        gender: userData.gender,
        country: userData.country_id,
        city: userData.city_id,
        hobbies: userData.hobbies
          ? userData.hobbies.split(",").map(Number)
          : [],
      });
    } catch (error) {
      message.error("Failed to load form data");
    }
  };

  const handleCountryChange = async (value) => {
    try {
      const response = await axiosInstance.get(
        `/master/cities/by-country/${value}`
      );
      setCities(response.data.data.results || []);
      form.setFieldValue("city", undefined); // Reset city when country changes
    } catch (error) {
      message.error("Failed to load cities");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.user_id = userId;
    try {
      const response = await axiosInstance.put("/user/updatePD", values);
      message.success(response.data.message);
      navigate("/user/dashboard", { replace: true });
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Personal Information">
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[{ required: true, message: "Please enter your age" }]}
              >
                <InputNumber min={1} max={120} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  { required: true, message: "Please select your gender" },
                ]}
              >
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number",
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter mobile number"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="marital_status"
                label="Marital Status"
                rules={[
                  { required: true, message: "Please select marital status" },
                ]}
              >
                <Select placeholder="Select marital status">
                  <Option value="single">Single</Option>
                  <Option value="married">Married</Option>
                  <Option value="divorced">Divorced</Option>
                  <Option value="widowed">Widowed</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <TextArea
                  prefix={<HomeOutlined />}
                  placeholder="Enter your address"
                  rows={4}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please select your country" },
                ]}
              >
                <Select
                  placeholder="Select country"
                  onChange={handleCountryChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {countries &&
                    countries.map((country) => (
                      <Option key={country.id} value={country.id}>
                        {country.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please select your city" }]}
              >
                <Select
                  placeholder="Select city"
                  showSearch
                  optionFilterProp="children"
                  // disabled={!form.getFieldValue("country")}
                >
                  {cities &&
                    cities.map((city) => (
                      <Option key={city.id} value={city.id}>
                        {city.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="hobbies"
                label="Hobbies"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one hobby",
                  },
                ]}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row gutter={[16, 8]}>
                    {hobbies.map((hobby) => (
                      <Col span={8} key={hobby.id}>
                        <Checkbox value={hobby.id}>{hobby.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Information
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default PersonalInfoForm;
