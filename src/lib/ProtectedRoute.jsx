import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./axios.js";
import globalState from "./globalState.js";

const ProtectedRoute = ({ children }) => {
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    async function getLoggedInUser() {
      try {
        const response = await axiosInstance.get(`/user/getLoggedInuser`);
        if (response.data.user) {
          setLoggedInUser(response.data.user);
        } else {
          throw Error;
        }
      } catch (error) {
        navigate("/login", { replace: true });
      }
    }
    if (!loggedInUser) {
      getLoggedInUser();
    }
  }, [loggedInUser]);

  if (loggedInUser) {
    return children;
  }
};
export default ProtectedRoute;
