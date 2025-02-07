import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import globalState from "./lib/globalState.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProtectedRoute from "./lib/ProtectedRoute.jsx";

const HomePage = React.lazy(() => import(`./pages/HomePage`));
const SignUpPage = React.lazy(() => import("./pages/auth/SignUpPage"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import(`./pages/auth/ForgotPasswordPage`));
const ResetPasswordPage = React.lazy(() => import(`./pages/auth/ResetPasswordPage`));
const PoliciesPage = React.lazy(() => import("./pages/auth/PoliciesPage.jsx"));
const VerifyEmailPage = React.lazy(() => import("./pages/auth/VerifyEmailPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ReelsPage = React.lazy(() => import("./pages/ReelsPage"));
const MessagePage = React.lazy(() => import("./pages/MessagePage.jsx"));
const AdsPage = React.lazy(() => import("./pages/AdsPage.jsx"));
const ShopPage = React.lazy(() => import("./pages/ShopPage.jsx"));
const GamePage = React.lazy(() => import("./pages/GamePage.jsx"));
const PaymentPage = React.lazy(() => import("./pages/payment/PaymentPage.jsx"));
const CreateBusinessAccount = React.lazy(() => import("./pages/business/CreateBusinessAccount.jsx"));
const BusinessProfileLandingPage = React.lazy(() => import("./pages/business/BusinessProfileLandingPage.jsx"));
const CreateAd = React.lazy(() => import("./pages/business/CreateAd.jsx"));
const BusinessProfileComplete = React.lazy(() => import("./pages/business/BusinessProfileComplete.jsx"));

function App() {
  const { disconnectSocket } = globalState();
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const isLoggedOut = globalState((state) => state.isLoggedOut);

  useEffect(() => {
    function disconnectWebSocket() {
      disconnectSocket();
    }
    window.addEventListener("beforeunload", disconnectWebSocket);
    return () => {
      window.removeEventListener("beforeunload", disconnectWebSocket);
    };
  }, [disconnectSocket]);

  useEffect(() => {
    if (isLoggedOut) {
      disconnectSocket();
      setLoggedInUser(null);
    }
  }, [isLoggedOut, disconnectSocket, setLoggedInUser]);

  return (
    <PayPalScriptProvider options={{ "client-id": "AXdP2FMNIC0mX8ScS_-UgWclU-O6FYn6gesWZ9ogLpCFkqip2cdCoLNYUCGbF5zWizNddJkxvd_L-7tB", currency: "USD" }}>
      <Suspense
        fallback={
          <div className="h-screen flex justify-center items-center">
            <p className="spinOnButton h-[30px] w-[30px]"></p>
          </div>
        }
      >
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/verifyEmail" element={<VerifyEmailPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/business-landing" element={<BusinessProfileLandingPage />} />
          <Route path="/create-business-account" element={<CreateBusinessAccount />} />
          <Route path="/business-profile-complete" element={<BusinessProfileComplete />} />
          <Route path="/create-advertisement" element={<CreateAd />} />
          <Route
            path="/home/:postId"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads-manager"
            element={
              <ProtectedRoute>
                <AdsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userProfile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <ReelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message/:friendId"
            element={
              <ProtectedRoute>
                <MessagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute>
                <MessagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-page"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </PayPalScriptProvider>
  );
}

export default App;
