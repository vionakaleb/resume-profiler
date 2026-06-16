import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import { TextField } from "../components/ui/Field.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      await register({ username, email, password, fullName });
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.message || "Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md rounded-2xl p-8 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Start building your resume in a minute.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextField
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="jane_doe"
          />
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <TextField
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Jane Doe"
          />
          <label className="block">
            <span className="label-base">Password</span>
            <input
              type="password"
              className="input-base"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          <label className="block">
            <span className="label-base">Confirm password</span>
            <input
              type="password"
              className="input-base"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </label>

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={busy}
          >
            {busy ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
