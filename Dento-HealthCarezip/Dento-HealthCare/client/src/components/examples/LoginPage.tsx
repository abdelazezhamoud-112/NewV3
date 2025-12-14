import LoginPage from "../LoginPage";

export default function LoginPageExample() {
  return <LoginPage onLogin={(userType, username) => console.log("تم تسجيل الدخول:", userType, username)} />;
}
