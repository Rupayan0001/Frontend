import userProfilePicStore from "./userProfilePicStore.js";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {
    // const navigate = useNavigate();
    const isAuth = userProfilePicStore((state)=> state.isAuthenticated);
    // console.log("isAuth", isAuth)

    if(!isAuth){
        return <Navigate to="/login" replace/>
    }
    return children;
}
export default ProtectedRoute;