import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserFeedback, registerUser } from "../redux/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
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
    setImageError("");
    dispatch(clearUserFeedback());
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files?.[0];
    setImageError("");
    dispatch(clearUserFeedback());

    if (!imageFile) {
      setFormData((currentFormData) => ({ ...currentFormData, image: "" }));
      setImageLoading(false);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      setFormData((currentFormData) => ({ ...currentFormData, image: "" }));
      setImageLoading(false);
      setImageError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      setFormData((currentFormData) => ({ ...currentFormData, image: "" }));
      setImageLoading(false);
      setImageError("Choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    setImageLoading(true);
    reader.onload = () => {
      setImageLoading(false);
      if (typeof reader.result === "string") {
        setFormData((currentFormData) => ({
          ...currentFormData,
          image: reader.result,
        }));
      } else {
        setFormData((currentFormData) => ({ ...currentFormData, image: "" }));
        setImageError("The selected image could not be read.");
      }
    };
    reader.onerror = () => {
      setImageLoading(false);
      setFormData((currentFormData) => ({ ...currentFormData, image: "" }));
      setImageError("The selected image could not be read.");
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      setFormData({ name: "", email: "", password: "", image: "" });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <main className="page-shell login-shell">
      {showSuccess && (
        <div className="login-success-popup">✓ Account created successfully!</div>
      )}
      <div className="page-container">
        <section className="login-layout" aria-labelledby="register-title">
          <div className="login-editorial">
            <p className="eyebrow">NOUVEAU / YOUR NEXT CHAPTER</p>
            <h1 id="register-title">
              Make it
              <br />
              yours.
            </h1>
            <p className="login-intro">
              Create an account for a more personal way to discover the
              collection.
            </p>

            <div className="login-still-life" aria-hidden="true">
              <span className="login-still-life__label">OBJECT STUDY / 02</span>
              <div className="login-still-life__object" />
              <span className="login-still-life__caption">
                Made for the everyday.
              </span>
            </div>
          </div>

          <div className="login-panel">
            <p className="eyebrow">JOIN NOUVEAU</p>
            <h2 className="text-5xl mb-3">Create account</h2>
            <p className="login-panel__copy">
              A few details to get you started.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="register-image">Profile image (optional)</label>
                <input
                  id="register-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <img
                    className="register-image-preview"
                    src={formData.image}
                    alt="Selected profile preview"
                  />
                )}
              </div>
              <div className="login-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  autoComplete="name"
                  placeholder="Your name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="register-email">Email address</label>
                <input
                  id="register-email"
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
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <p className="form-feedback form-feedback--error" role="alert">
                  {error}
                </p>
              )}
              {imageError && (
                <p className="form-feedback form-feedback--error" role="alert">
                  {imageError}
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

              <button className="login-submit" type="submit" disabled={loading || imageLoading || Boolean(imageError)}>
                {imageLoading
                  ? "PREPARING IMAGE…"
                  : loading
                    ? "CREATING ACCOUNT…"
                    : "CREATE ACCOUNT"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-register">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
