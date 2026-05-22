import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return { logout };
};

export default useLogout;
