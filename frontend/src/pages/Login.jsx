import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserFeedback, loginUser } from "../redux/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearUserFeedback());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
    dispatch(clearUserFeedback());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      setFormData({ email: "", password: "" });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <main className="page-shell login-shell">
      {showSuccess && (
        <div className="login-success-popup">✓ Successfully logged in!</div>
      )}
      <div className="page-container">
        <section className="login-layout" aria-labelledby="login-title">
          <div className="login-editorial">
            <p className="eyebrow">NOUVEAU / MEMBER ACCESS</p>
            <h1 id="login-title">
              Welcome
              <br />
              back.
            </h1>
            <p className="login-intro">
              A considered collection, picked up right where you left it.
            </p>

            <div className="login-still-life" aria-hidden="true">
              <span className="login-still-life__label">OBJECT STUDY / 01</span>
              <div className="login-still-life__object" />
              <span className="login-still-life__caption">
                Made for the everyday.
              </span>
            </div>
          </div>

          <div className="login-panel">
            <p className="eyebrow">YOUR ACCOUNT</p>
            <h2 className="text-5xl mb-3">Sign in</h2>
            <p className="login-panel__copy">Enter your details to continue.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <p className="form-feedback form-feedback--error" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p
                  className="form-feedback form-feedback--success"
                  role="status"
                >
                  {message}
                </p>
              )}

              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? "SIGNING IN…" : "SIGN IN"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-register">
              New to Nouveau? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
