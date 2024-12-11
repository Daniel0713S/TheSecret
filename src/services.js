
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, createUserWithEmailAndPassword, signOut } from "firebase/auth";

/* export function fetchEntries() {
    return fetch(`/api/v2/entries`, {
        method: 'GET',
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
        if (response.ok) {
            return response.json();
        }
        return response.json()
        .catch( error => Promise.reject({ error }) )
        .then( err => Promise.reject(err) );
    });
} */

/* export function fetchAddEntry(title, content) {
    return fetch(`/api/v2/entries`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ title, content }),
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
        if (response.ok) {
        return response.json();
        }
        return response.json()
        .catch( error => Promise.reject({ error }) )
        .then( err => Promise.reject(err) );
    });
}

export function fetchDeleteEntry(id) {
    return fetch(`/api/v2/entries/${id}`,  {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
      .catch( error => Promise.reject({ error }) )
      .then( err => Promise.reject(err) );
    });
}

export function fetchUpdateEntry(id, updates) {
    return fetch(`/api/v2/entries/${id}`, {
        method: 'PATCH',
        headers: new Headers({
            'content-type': 'application/json',
          }),
          body: JSON.stringify( updates ),
        })
        .catch( () => Promise.reject({ error: 'networkError' }) )
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          return response.json()
          .catch( error => Promise.reject({ error }) )
          .then( err => Promise.reject(err) );
    })
}

export function fetchLogin(username) {
    return fetch(`/api/v2/session`, {

        method: 'POST',
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({ username }),
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
        if (response.ok) {
            return response.json();
        }
        return response.json()
        .catch( error => Promise.reject({ error }) )
        .then( err => Promise.reject(err) );
    });
} 



export function fetchLogout() {
    return fetch(`/api/v2/session`, {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
        if (response.ok) {
            return response.json();
        }
        return response.json()
        .catch( error => Promise.reject({ error }) )
        .then( err => Promise.reject(err) );
    });
} 




export function fetchSession() {
    return fetch(`/api/v2/session`, {
        method: 'GET',
    })
    .catch( () => Promise.reject({ error: 'networkError' }) )
    .then( response => {
        if (response.ok) {
            return response.json();
        }
        return response.json()
        .catch( error => Promise.reject({ error }) )
        .then( err => Promise.reject(err) );
    });
}  */

async function getFirebaseToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    try {
        const token = await user.getIdToken(true); // Force refresh
        console.log("Firebase Token:", token); // Debugging
        return token;
    } catch (error) {
        console.error("Failed to retrieve Firebase Token:", error);
        throw new Error("Failed to authenticate user");
    }
}

export async function fetchEntries() {
    const token = await getFirebaseToken();
    return fetch(`/api/v2/entries`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }),
        credentials: 'include', // Include cookies if needed
    })
    .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
    .catch(error => {
        console.error("Failed to fetch entries:", error);
        return Promise.reject({ error: 'networkError', message: error.message });
    });
}

export async function fetchAddEntry(title, content) {
    console.log("Adding entry with title and content:", { title, content }); // Debugging
    const token = await getFirebaseToken();
    return fetch(`/api/v2/entries`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }),
        credentials: 'include',
        body: JSON.stringify({ title, content }),
    })
    .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
    .catch(error => {
        console.error("Failed to add entry:", error);
        return Promise.reject({ error: 'networkError', message: error.message });
    });
}

export async function fetchDeleteEntry(id) {
    const token = await getFirebaseToken();
    return fetch(`/api/v2/entries/${id}`, {
        method: 'DELETE',
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
        credentials: 'include',
    })
    .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
    .catch(error => {
        console.error("Failed to delete entry:", error);
        return Promise.reject({ error: 'networkError', message: error.message });
    });
}

export async function fetchUpdateEntry(id, updates) {
    const token = await getFirebaseToken();
    return fetch(`/api/v2/entries/${id}`, {
        method: 'PATCH',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }),
        credentials: 'include',
        body: JSON.stringify(updates),
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Return the updated entry
        } else {
            return response.json().then(err => Promise.reject(err));
        }
    })
    .catch(error => {
        console.error("Failed to update entry:", error);
        return Promise.reject({ error: 'networkError', message: error.message });
    });
}

export async function fetchLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { username: userCredential.user.email };
    } catch (error) {
        console.error("Login Failed:", error.message);
        return Promise.reject({ error: 'auth-failed', message: error.message });
    }
}

export async function fetchSignup(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { username: userCredential.user.email };
    } catch (error) {
        // Firebase provides error codes, so we map them to meaningful messages
        if (error.code === "auth/email-already-in-use") {
            return Promise.reject({ error: "auth/email-already-in-use" });
        } else if (error.code === "auth/weak-password") {
            return Promise.reject({ error: "auth/weak-password" });
        } else if (error.code === "auth/invalid-email") {
            return Promise.reject({ error: "auth/invalid-email" });
        }
        return Promise.reject({ error: "signup-failed" });
    }
}

export async function fetchGoogleLogin() {
    try {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account', // Force account selection
        });
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();
        console.log("Google Login Success:", { email: user.email, token }); // Debugging
        return { username: user.email, token };
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            console.log("Google Login popup closed by user."); // Handle silently
            return Promise.reject({ error: 'popup-closed' });
        }
        console.error("Google Login Failed:", error.message);
        return Promise.reject({ error: 'auth-failed', message: error.message });
    }
}

export async function fetchLogout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout Failed:", error.message);
        return Promise.reject({ error: 'logout-failed', message: error.message });
    }
}



export async function fetchSummary(text) {
    const token = await getFirebaseToken();
    return fetch('/api/v2/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    })
      .then(async (response) => {
        console.log("Fetch response status:", response.status);
        if (response.ok) {
          return response.json();
        } else if (response.status === 429) {
          const error = await response.json();
          console.error("Quota error:", error);
          return Promise.reject(error);
        } else {
          const error = await response.json();
          console.error("Other error:", error);
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        console.error("Fetch failed:", error);
        throw error;
      });
  }
  


