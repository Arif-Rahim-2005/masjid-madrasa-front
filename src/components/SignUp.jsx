import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginModal from "./Login";

const API_URL = import.meta.env.VITE_API_URL;

const SignUpModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed.");
        return;
      }

      // Store JWT if signup returns one
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      // Store the newly created user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Account created successfully!");

      onClose();
    } catch (error) {
      console.error("Signup error:", error);

      alert(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    return <LoginModal onClose={() => setShowLogin(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-8 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
          aria-label="Close signup"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-green-700">
          Create an Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          {/* Username */}
          <div>
            <label
              htmlFor="signup-username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>

            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none text-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-green-600 outline-none text-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-8 right-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Switch to Login */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              className="text-green-700 hover:underline"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
