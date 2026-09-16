import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const users = [
    {email: "admin@cornortech.com", password: "admin123", role: "admin" },
    { email: "employee@cornortech.com", password: "emp123", role: "employee"},
];

export default function Login() 
{
    const[email, setEmail] = useState("");
     const[password, setPassword] = useState("");
      const[error, setError] = useState("");
       const navigate = useNavigate();

      const handleLogin = (e) => 
        {
            e.preventDefault();
            setError("");

            if (!email.trim() || !password.trim())
            {
                setError("Please enter both email and password");
                return;
            }
             const foundUser = users.find((u) => u.email === email.trim());

             if (!foundUser) {
                setError("User not found");
                return;
             }
             if (foundUser.password !== password)
             {
                setError("Invalid credentials");
                return;
             }
           setError("");
            localStorage.setItem("loggedInUser",JSON.stringify(foundUser));
            localStorage.setItem("cornor_ems_auth", "true");
            if (foundUser.role === "admin")
            {
              navigate("/admin-dashboard");
            }
            else{
              navigate("/employee-dashboard");
            }
        };
        return(
            <div className="login-page">
                <div className="login-banner">TaskFlow</div>
                <form className="login-card" onSubmit={handleLogin}>
                    <h2 className="login-title">Login</h2>

                    <label className="login-label">Email</label>
                    <input type="email" 
                    placeholder = "admin@cornortech.com"
                     value ={email}
                     onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
        />  
        <label className="login-label">Password</label>
                    <input type="password" 
                    placeholder = "admin123"
                     value ={password}
                     onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    />
                    {error && <p className="login-error">{error}</p>}

                    <div className="login-row">
          <label className="login-checkbox">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" className="login-link">Forgot password?</a>
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}