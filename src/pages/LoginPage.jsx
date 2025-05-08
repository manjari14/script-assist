import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Box,
  Stack,
  Image,
  Alert,
  Container,
  Flex,
} from "@mantine/core";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff } from "tabler-icons-react"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      login();
      navigate("/resources");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: "100%",
        backgroundColor: "transparent",
        display: "flex",
      }}
    >
      <Card
        shadow="xl"
        radius="lg"
        withBorder
        style={{
          width: 900,
          height: "80%",
          display: "flex",
          alignItems: "center",
          marginTop: "90px",
          borderRadius: "10px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Left - Image */}
        <Box style={{ width: "50%", height: "100%", display: "flex" }}>
          <Image
            src="../images/space.jpg"
            alt="Script Assist"
            height="100%"
            width="100%"
            fit="cover"
          />
        </Box>

        {/* Right - Form */}
        <Box
          style={{
            width: "50%",
            height: "100%",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box style={{ width: "100%" }} className="login-container">
            <Stack spacing="lg">
              {/* {error && <Alert color="red">{error}</Alert>} */}

              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                size="md"
                radius="md"
                required
                withAsterisk
                style={{ padding: "0.75rem" }}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                size="md"
                radius="md"
                required
                withAsterisk
                style={{ padding: "0.75rem" }}
                visibilityToggle={false}
              />

              <Button
                fullWidth
                size="md"
                radius="md"
                color="teal"
                onClick={handleLogin}
              >
                Log In
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Flex>
  );
};

export default LoginPage;
