import React, { useContext, useState } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, SetPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error("회원 아이디를 3자 이상으로 해주세요.");
      if (password.length < 6)
        throw new Error("비밀번호를 6자 이상으로 해주세요.");
      if (password !== passwordCheck)
        throw new Error("비밀번호가 다릅니다. 다시 입력해주세요.");
      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      });
      toast.success("회원가입 성공!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>회원가입</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="이름" value={name} setValue={setName} />
        <CustomInput label="회원ID" value={username} setValue={setUsername} />
        <CustomInput
          label="비밀번호"
          value={password}
          setValue={SetPassword}
          type="password"
        />
        <CustomInput
          label="비밀번호 확인"
          value={passwordCheck}
          setValue={setPasswordCheck}
          type="password"
        />
        <div style={{ marginTop: 15 }}>
          <button type="submit" className="btn btn-outline-success">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
