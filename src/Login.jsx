
import { MESSAGES, SERVER } from './constants';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, } from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';
import React, { useState } from "react";
import { fetchLogin, fetchGoogleLogin, fetchSignup } from "./services";



function Login({ onLogin}) {
    //const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUpMode, setIsSignUpMode] = useState(false);

/*     function onChange(e) {
        setUsername(e.target.value);
        setError('');
    }

    function validateUsername(name) {
        if (!name.trim()) {
            setError(MESSAGES.EMPTY_USERNAME);
            return false;
        }

        if (name.toLowerCase() === 'dog') {
            setError(MESSAGES[SERVER.AUTH_INSUFFICIENT]);
            return false;
        }
        
        if (!/^[a-zA-Z0-9]+$/.test(name)) {
            setError(MESSAGES[SERVER.REQUIRED_USERNAME]);
            return false;
        }
        
        return true;
    }

    function onSubmit(e) {
        e.preventDefault(); 
        if (validateUsername(username)) {  
            onLogin(username); 
        }
    } */
    


        //v2
/* const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
        const user = await fetchLogin(email, password);
        onLogin(user);
    } catch (err) {
        if (err.error === 'auth-failed') {
            setError("Invalid email or password. Please try again.");
        } else if (err.error === 'networkError') {
            setError("Network error. Please check your connection and try again.");
        } else {
            setError("An unexpected error occurred. Please try again later.");
        }
    }
}; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isSignUpMode) {
            const user = await fetchSignup(email, password);
            onLogin(user);
        } else {
            const user = await fetchLogin(email, password);
            onLogin(user);
        }
    } catch (err) {
        if (err.error === 'auth-failed') {
            setError("Invalid email or password. Please try again.");
        } else if (err.error === 'auth/email-already-in-use') {
            setError("This email is already in use. Please try logging in or use a different email.");
        } else if (err.error === 'auth/weak-password') {
            setError("Password is too weak. Please use a stronger password.");
        } else if (err.error === 'networkError') {
            setError("Network error. Please check your connection and try again.");
        } else {
            setError("An unexpected error occurred. Please try again later.");
        }
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const user = await fetchGoogleLogin();
        onLogin(user);
      } catch (err) {
        if (err.error !== 'popup-closed') {
          setError("Failed to log in with Google.");
        }
      }
  };


  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setError(''); // Clear any previous errors when switching modes
  }; 

    //v2
/*     const handleSignup = async (e) => {
    e.preventDefault();
    try {
        const user = await fetchSignup(email, password);
        onLogin(user);
    } catch (err) {
        if (err.error === 'signup-failed') {
            setError("Failed to sign up. Please check your email and try again.");
        } else if (err.error === 'auth/email-already-in-use') {
            setError("This email is already in use. Please try logging in or use a different email.");
        } else if (err.error === 'auth/weak-password') {
            setError("Password is too weak. Please use a stronger password.");
        } else if (err.error === 'networkError') {
            setError("Network error. Please check your connection and try again.");
        } else {
            setError("An unexpected error occurred during sign-up. Please try again later.");
        }
    }
}; */



// v1
/*     return (
        <div className="login">
            <form className="login__form"  onSubmit={onSubmit}>
                <h1>Login</h1>
                <label htmlFor="usernameInput">
                    
                    <input 
                        id="usernameInput"
                        className="login__username" 
                        type="text" 
                        value={username} 
                        onChange={onChange}
                        placeholder='Enter your username'
                    />
                </label>
                <button className="login__button" type="submit">Login</button>
            
                {error && <div className="error__message" aria-live="assertive">{error}</div>}
            </form>
        </div>
    ); */
    

  // v2
/*     return (
      <div className="login">
          <form className="login__form" onSubmit={handleEmailLogin}>
              <h1>Login</h1>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
              />
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
              />
              <button type="submit">Login</button>
              <button onClick={handleGoogleLogin}>Login with Google</button>
          </form>
          
          <form onSubmit={handleSignup}>
              <button type="submit">Sign Up</button>
          </form>
          {error && <p>{error}</p>}
      </div>
  ); */

  return (
    <div className="login">
        <form className="login__form" onSubmit={handleSubmit}>
            <h1>{isSignUpMode ? "Sign Up" : "Login"}</h1>
            <label htmlFor="emailInput">
                <input
                    type="email"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
            </label>
            <label htmlFor="passwordInput">
                <input
                    type="password"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
            </label>
            <button type="submit">{isSignUpMode ? "Sign Up" : "Login"}</button>
            {!isSignUpMode && (
                <button type="button" onClick={handleGoogleLogin}>
                    Login with Google
                </button>
            )}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle__mode"
            >
              {isSignUpMode ? "Switch to Login" : "Switch to Sign Up"}
            </button>
            {error && <p className="error">{error}</p>}
        </form >
        
    </div>
);

}

export default Login;