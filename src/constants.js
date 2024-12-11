export const LOGIN_STATUS = {
    PENDING: 'pending',
    NOT_LOGGED_IN: 'notLoggedIn',
    IS_LOGGED_IN: 'loggedIn',
};
  
 
export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    REQUIRED_ENTRY: 'required-entry',
    ENTRY_MISSING: 'noSuchId',
    
};
  
export const CLIENT = {
    NETWORK_ERROR: 'networkError',
    NO_SESSION: 'noSession',
    FIREBASE_AUTH_ERROR: 'firebaseAuthError',
};
  
export const MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again',
    [CLIENT.NO_SESSION]: 'No active session found. Please log in.',
    [SERVER.AUTH_MISSING]: 'Authentication missing or invalid. Please log in again.',
    [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
    [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username',
    [SERVER.REQUIRED_ENTRY]: 'Please provide all required entry details.',
    [SERVER.ENTRY_MISSING]: 'The requested entry could not be found or does not exist.',
    
    EMPTY_USERNAME: 'Username cannot be empty.',
    default: 'Something went wrong.  Please try again',
};

export const ACTIONS = {
    LOG_IN: 'logIn',
    LOG_OUT: 'logOut',
    START_LOADING_ENTRIES: 'startLoadingEntries',
    REPLACE_ENTRIES: 'replaceEntries',
    REPORT_ERROR: 'reportError',
    UPDATE_ENTRY: 'updateEntry',
    DELETE_ENTRY: 'deleteEntry',
    ADD_ENTRY: 'addEntry',
};


