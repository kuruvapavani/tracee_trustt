import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function SignInForm({ userRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flow, setFlow] = useState("signIn"); // "signIn" or "signUp"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (flow === "signIn") {
        await login(email, password, userRole);
      } else {
        await register(email, password, userRole);
        toast.success("Registered successfully! You can now sign in.");
        setFlow("signIn");
      }
    } catch (error) {
      // toast handled inside AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          {flow === "signIn" ? "Sign In" : "Sign Up"}
        </h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholder="your@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          {isSubmitting
            ? flow === "signIn"
              ? "Signing In..."
              : "Registering..."
            : flow === "signIn"
              ? `Sign In as ${userRole === 'admin' ? 'Admin' : 'Consumer'}`
              : "Sign Up"}
        </button>
        <p className="text-center text-sm mt-4">
          {flow === "signIn"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            type="button"
            className="ml-1 text-blue-600 hover:underline"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </div>
  );
}
