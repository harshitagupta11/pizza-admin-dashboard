import {
  Alert,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Input,
  Layout,
  Space,
} from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";

import Logo from "../../components/icons/Logo";

import type { Credentials } from "../../types";
import { login, self } from "../../http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore, type User } from "../../store";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const LoginPage = () => {
  const loginUser = async (userData: Credentials) => {
    const { data } = await login(userData);
    return data;
  };

  const { setUser } = useAuthStore();

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"], // Unique key for the mutation
    // Define the mutation function
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch();
      setUser(selfDataPromise.data as User);
    },
  });

  return (
    <Layout style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <Space direction="vertical" size="large" align="center">
        <Layout.Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo />
        </Layout.Content>
        <Card
          title={
            <Space
              style={{
                width: "100%",
                fontSize: 16,
                justifyContent: "center",
              }}
            >
              <LockFilled />
              <span>Sign in</span>
            </Space>
          }
          variant="borderless"
          style={{ width: 300 }}
        >
          <Form
            initialValues={{ remember: true }}
            onFinish={(values) => {
              mutate({ email: values.username, password: values.password });
              console.log("Form values:", values);
            }}
          >
            {isError && (
              <Alert
                style={{ marginBottom: 24 }}
                type="error"
                message={error.message}
              />
            )}

            <Form.Item
              name={"username"}
              rules={[
                { required: true, message: "Please input your username!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username"></Input>
            </Form.Item>
            <Form.Item
              name={"password"}
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Flex justify="space-between">
              <Form.Item name={"remember"} valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a id="login-form-forgot" href="#">
                Forgot Password
              </a>
            </Flex>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={isPending}
                disabled={isPending}
              >
                {" "}
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
};

export default LoginPage;
