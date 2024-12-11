import { useEffect, useReducer, useState } from 'react';

import './App.css';
import reducer, { initialState } from './reducer';
import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
  ACTIONS,
} from './constants';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchEntries,
  fetchAddEntry,
  fetchUpdateEntry,
  fetchDeleteEntry,
} from './services';

import Login from './Login';
import { auth } from './firebaseConfig';

import { onAuthStateChanged } from 'firebase/auth';

import DiaryList from './DiaryList';
import Loading from './Loading';
import Status from './Status';
import DiaryEntryForm from './DiaryEntryForm';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);


  /* function onLogin(username) {
    dispatch({ type: ACTIONS.START_LOADING_ENTRIES });
    fetchLogin(username)
      .then(() => {
        dispatch({ type: ACTIONS.LOG_IN, username });
        return fetchEntries();
      })
      .then(entries => {
        dispatch({ type: ACTIONS.REPLACE_ENTRIES, entries });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.error });
      });
  } 

  function onLogout() {
    //fetchLogout()
    firebaseLogout()
      .then(() => {
        dispatch({ type: ACTIONS.LOG_OUT });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.error });
      });
  } 




  function onAddEntry(entry) {
    dispatch({ type: ACTIONS.START_LOADING_ENTRIES });
    fetchAddEntry(entry.title, entry.content)
      .then(newEntry => {
        dispatch({ type: ACTIONS.ADD_ENTRY, entry: newEntry });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.error });
      });
  }

  function onUpdateEntry(id, updatedData) {
    dispatch({ type: ACTIONS.START_LOADING_ENTRIES });
    fetchUpdateEntry(id, updatedData)
      .then(updatedEntry => {
        dispatch({ type: ACTIONS.UPDATE_ENTRY, entry: updatedEntry });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.error });
      });
  }

  function onDeleteEntry(id) {
    dispatch({ type: ACTIONS.START_LOADING_ENTRIES });
    fetchDeleteEntry(id)
      .then(() => {
        dispatch({ type: ACTIONS.DELETE_ENTRY, id: id });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.error });
      });
  }

  function checkForSession() {
    fetchSession()
    .then(sessionInfo => {
      if (!sessionInfo.username) {
        throw new Error(CLIENT.NO_SESSION); 
      }
      dispatch({ type: ACTIONS.LOG_IN, username: sessionInfo.username });
      return fetchEntries();
    })
    .then(entries => {
      dispatch({ type: ACTIONS.REPLACE_ENTRIES, entries });
    })
    .catch(err => {
      if (err.message === CLIENT.NO_SESSION || err?.error === SERVER.AUTH_MISSING) {
        dispatch({ type: ACTIONS.LOG_OUT });
      } else {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: err.message || 'Unknown error' });
      }
    });
  }

  useEffect(() => {
    checkForSession();
  }, []);  */


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            dispatch({ type: ACTIONS.LOG_IN, username: user.email });
            fetchEntries()
                .then((entries) => {
                    dispatch({ type: ACTIONS.REPLACE_ENTRIES, entries });
                })
                .catch((error) => {
                    dispatch({ type: ACTIONS.REPORT_ERROR, error: "Failed to fetch entries. Please try again." });
                });
        } else {
            // User is logged out
            dispatch({ type: ACTIONS.LOG_OUT });
        }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
}, []);

const handleLogin = (user) => {
    dispatch({ type: ACTIONS.LOG_IN, username: user.username });
};

const handleLogout = async () => {
    try {
        await fetchLogout();
        dispatch({ type: ACTIONS.LOG_OUT });
    } catch (error) {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: "Failed to log out. Please try again." });
    }
};

const handleAddEntry = async (title, content) => {
    try {
        const newEntry = await fetchAddEntry(title, content);
        dispatch({
          type: ACTIONS.REPLACE_ENTRIES, 
          entries: [...state.entries, newEntry],
      });
        //dispatch({ type: ACTIONS.ADD_ENTRY, entry: newEntry });
    } catch (error) {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: "Failed to add entry. Please try again." });
    }
};

const handleUpdateEntry = async (id, updates) => {
    try {
        const updatedEntry = await fetchUpdateEntry(id, updates);
        const updatedEntries = state.entries.map(entry =>
          entry.id === id ? updatedEntry : entry
      );
      dispatch({ type: ACTIONS.REPLACE_ENTRIES, entries: updatedEntries }); 
        //dispatch({ type: ACTIONS.UPDATE_ENTRY, entry: updatedEntry });
    } catch (error) {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: "Failed to update entry. Please try again." });
    }
};

const handleDeleteEntry = async (id) => {
    try {
        await fetchDeleteEntry(id);
        const remainingEntries = state.entries.filter(entry => entry.id !== id);
        dispatch({ type: ACTIONS.REPLACE_ENTRIES, entries: remainingEntries });
        //dispatch({ type: ACTIONS.DELETE_ENTRY, id: _id });
    } catch (error) {
        dispatch({ type: ACTIONS.REPORT_ERROR, error: "Failed to delete entry. Please try again." });
    }
};



/*   return (
   
    <div className="app">
      <main>
        {state.error && <Status error={state.error} />}
        {state.loginStatus === LOGIN_STATUS.PENDING && <Loading />}
        {state.isEntriesLoading && <Loading className="loading">Loading entries...</Loading>}
        {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <Login onLogin={onLogin} />}
        
        {state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
         <>  
            
            <div className="welcome__message">
              <div className="welcome__content">
                <h1>Hello! {state.username}. Welcome to your Secret Cabin!</h1>
                <p>Begin to open your heart and jot down your little secrets. This is your safe space to reflect, dream, and grow!</p>
              </div>
                
                <button onClick={onLogout} className='logout__button'>Logout</button>  
            </div>
                
            <div className="content">
              <DiaryList entries={state.entries} onDeleteEntry={onDeleteEntry} onUpdateEntry={onUpdateEntry} />
              <DiaryEntryForm onAddEntry={onAddEntry} onUpdateEntry={onUpdateEntry} />
              
            </div>

          </>
        )}
      </main>
    </div>
    
  );  */

  return (
   
    <div className="app">
      <main>
        {state.error && <Status error={state.error} />}
        {state.loginStatus === LOGIN_STATUS.PENDING && <Loading />}
        {state.isEntriesLoading && <Loading className="loading">Loading entries...</Loading>}
        {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <Login onLogin={handleLogin} />}
        
        {state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
         <>  
            
            <div className="welcome__message">
              <div className="welcome__content">
                <h1>Hello! {state.username.split('@')[0]}. Welcome to your Secret Cabin!</h1>
                <p>Begin to open your heart and jot down your secrets. This is your safe space to think, dream, and grow!</p>
              </div>
                
                <button onClick={handleLogout} className='logout__button'>Logout</button>  
            </div>
                
            <div className="content">
              <DiaryList entries={state.entries} onDeleteEntry={handleDeleteEntry} onUpdateEntry={handleUpdateEntry} />
              <DiaryEntryForm onAddEntry={handleAddEntry} onUpdateEntry={handleUpdateEntry} />
              
            </div>

          </>
        )}
      </main>
    </div>
    
  );   


}

export default App;
