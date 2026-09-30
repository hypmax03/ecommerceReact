import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="page-shell login-shell">
      <div className="page-container">
        <section className="login-layout" aria-labelledby="login-title">
          <div className="login-editorial">
            <p className="eyebrow">NOUVEAU / MEMBER ACCESS</p>
            <h1 id="login-title">Welcome<br />back.</h1>
            <p className="login-intro">
              A considered collection, picked up right where you left it.
            </p>

            <div className="login-still-life" aria-hidden="true">
              <span className="login-still-life__label">OBJECT STUDY / 01</span>
              <div className="login-still-life__object" />
              <span className="login-still-life__caption">Made for the everyday.</span>
            </div>
          </div>

          <div className="login-panel">
            <p className="eyebrow">YOUR ACCOUNT</p>
            <h2>Sign in</h2>
            <p className="login-panel__copy">Enter your details to continue.</p>

            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button className="login-submit" type="submit">
                SIGN IN <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-register">
              New to Nouveau? <Link to="/">Discover the collection</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
