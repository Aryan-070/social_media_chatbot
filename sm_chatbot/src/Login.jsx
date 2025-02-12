import { Button, Checkbox, Form, Input, Typography, Alert, message } from "antd";
import aiqwipLogo from "/src/assets/aiqwip.jpg";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
const { Text, Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [alertInfo, setAlertInfo] = useState(null);
  const handleLogin = async (values) => {
    try {
      const res = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access);
        setUser({ username: values.username });
        message.success("Login successful!");
        setAlertInfo({ type: 'success', message: 'Login successful!' });
        setTimeout(() => {
          navigate("/chat");
        }, 2000);
      } else {
        message.error("Invalid credentials");
        setAlertInfo({ type: 'error', message: 'Invalid credentials' });
      }
    } catch (err) {
      message.error("Login failed: " + err.message);
      setAlertInfo({ type: 'error', message: "Login failed: " + err.message });
    }
  };

  return (
    <div>
      {/* Alert rendered at the top */}
      {alertInfo && (
        <div className="w-full max-w-md mx-auto p-4">
          <Alert
            style={{ marginBottom: 16 }}
            message={alertInfo.message}
            type={alertInfo.type}
            showIcon
            closable
            onClose={() => setAlertInfo(null)}
          />
        </div>
      )}

    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="w-[380px] p-8 bg-white shadow-lg rounded-xl">
        <div className="mb-6 text-center">
          <img src={aiqwipLogo} alt="Aiqwip Logo" width="80" height="40" className="mx-auto" />
          <Title level={2} className="text-xl md:text-2xl mt-4">Sign in</Title>
          <Text className="text-gray-500 block mt-2">
            Welcome back to AIQWIP Social Media Chatbot 🤖! <br /> Please enter your details below to sign in.
          </Text>
        </div>

        <Form
          name="normal_login"
          layout="vertical"
          requiredMark="optional"
          onFinish={handleLogin}
          initialValues={{ username: "testuser", password: "testpassword" }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item

            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <div className="text-center mt-4">
              <Text className="text-gray-500">Don&apos;t have an account?</Text>{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up now
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
    </div>
  );
};

export default Login;
