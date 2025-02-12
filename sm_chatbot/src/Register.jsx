import { Button, Form, Input, Typography, message } from "antd";
import aiqwipLogo from "/src/assets/aiqwip.jpg";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
const { Text, Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleRegister = async (values) => {
    try {
      const res = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access);
        setUser({ username: values.username });
        message.success("Register successful!");
        navigate("/chat");
      } else {
        message.error("Invalid credentials");
      }
    } catch (err) {
      message.error("Register failed: " + err.message);
    }
  };
  const passwordValidationRules = [
    { required: true, message: "Please input your Password!" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.",
    },
  ];
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[380px] p-8 bg-white shadow-lg rounded-xl">
        <div className="mb-6 text-center">
          <img src={aiqwipLogo} alt="Aiqwip Logo" width="80" height="40" className="mx-auto" />
          <Title level={2} className="text-xl md:text-2xl mt-4">Sign Up</Title>
          <Text className="text-gray-500 block mt-2">
            Join us! Create an account to get started.
          </Text>
        </div>

        <Form
          name="normal_login"
          layout="vertical"
          requiredMark="optional"
          onFinish={handleRegister}
          initialValues={{ username: "testuser", password: "testpassword" }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>


          <Form.Item name="password" rules={passwordValidationRules} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* Password requirements below the input */}
          <div style={{ marginBottom: "10px", color: "#888" }}>
            <Text strong>Password must contain:</Text>
            <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (@$!%*?&)</li>
            </ul>
          </div>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
            <div className="text-center mt-4">
              <Text className="text-gray-500">Already have an account?</Text>{" "}
              <Link to="/" className="text-blue-500 hover:underline">Sign in</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Register;