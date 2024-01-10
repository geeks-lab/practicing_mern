import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch(
        "/users/logout",
        {},
        { headers: { sessionid: me.sessionId } }
      );
      setMe();
      toast.success("로그아웃!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container py-3 d-flex justify-content-between align-items-center">
      <Link to="/" className="text-decoration-none">
        <span className="h4 text-olive">Tiny Album📗</span>
      </Link>
      {me ? (
        <span onClick={logoutHandler} className="cursor-pointer text-info">
          로그아웃 ({me.name})
        </span>
      ) : (
        <div className="d-flex">
          <Link to="/auth/login" className="btn btn-outline-success">
            <div>로그인</div>
          </Link>
          <Link to="/auth/register" className="btn btn-outline-success ml-2">
            <div>회원가입</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ToolBar;
