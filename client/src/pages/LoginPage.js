import React, { useContext, useState } from "react";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3 || password.length < 6)
        throw new Error("입력하신 정보가 올바르지 않습니다.");
      const result = await axios.patch("/users/login", { username, password });
      axios.defaults.headers.common.sessionid = result.data.sessionId;
      setMe({
        name: result.data.name,
        sessionId: result.data.sessionId,
        userId: result.data.userId,
      });
      navigate("/");
      toast.success("로그인 성공!");
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <h3>로그인</h3>
      <form onSubmit={loginHandler}>
        <CustomInput label="회원ID" value={username} setValue={setUsername} />
        <CustomInput
          label="비밀번호"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <div style={{ marginTop: 20, width: 100 }}>
          <button type="submit" className="btn btn-outline-success">
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
