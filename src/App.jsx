import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import ReelsPage from "./pages/ReelsPage";
import MessagePage from "./pages/MessagePage.jsx";
import ProtectedRoute from "./lib/ProtectedRoute.jsx";


// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
  
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verifyEmail" element={<VerifyEmailPage />} />

      {/* <ProtectedRoute></ProtectedRoute> will use later to protect routes */}
      <Route path="/home/:postId" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/myProfile" element={<ProfilePage />} />
      <Route path="/userProfile/:userId" element={<ProfilePage />} />
      <Route path="/reels" element={<ReelsPage />} />
      <Route path="/message" element={<MessagePage />} />

      {/* <Route path="/getPost/:postId" element={<PostPage />} /> */}
    </Routes>
  
  )
}

export default App
