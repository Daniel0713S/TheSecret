import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

function SignUp({ onSignUpSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            onSignUpSuccess(userCredential.user);
        } catch (err) {
            setError('Sign-up failed. Please try again.');
            console.error('Firebase sign-up error:', err);
        }
    };

    return (
        <div className="signup">
            <form className="signup__form" onSubmit={handleSignUp}>
                <h1>Sign Up</h1>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                {error && <div className="error__message">{error}</div>}
            </form>
        </div>
    );
}

export default SignUp;
