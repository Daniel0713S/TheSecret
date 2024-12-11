import {
    LOGIN_STATUS,
    CLIENT,
    ACTIONS,
  } from './constants';
  
  export const initialState = {
    error: '',
    username: '',
    loginStatus: LOGIN_STATUS.PENDING,
    isEntriesLoading: false,
    entries: [],
    currentEntry: null,
  };
  
  function reducer(state, action) {
    switch (action.type) {
  
      case ACTIONS.LOG_IN:
        return {
          ...state,
          error: '',  
          loginStatus: LOGIN_STATUS.IS_LOGGED_IN,
          username: action.username,
        };
  
      case ACTIONS.START_LOADING_ENTRIES:
        return {
          ...state,
          error: '',
          isEntriesLoading: true,
        };
  
      case ACTIONS.REPLACE_ENTRIES:
        
        const validEntries = action.entries.filter(entry => entry && entry.content);
        return {
          ...state,
          error: '',
          isEntriesLoading: false,
          //entries: action.entries || [],
          entries: validEntries,
        };
  
      case ACTIONS.LOG_OUT:
        return {
          ...state,
          error: '',
          isEntriesLoading: false,
          entries: [],
          loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
          username: '',
        };
  
      case ACTIONS.REPORT_ERROR:
        return {
          ...state,
          isEntriesLoading: false,
          error: action.error || 'ERROR',
        };
  
      case ACTIONS.ADD_ENTRY:
        return {
          ...state,
          isEntriesLoading: false,
          entries: [...state.entries, action.entry],
        };
  
      case ACTIONS.UPDATE_ENTRY:
        return {
          ...state,
          isEntriesLoading: false,
          entries: state.entries.map(entry =>
            entry.id === action.entry.id ? action.entry : entry
          ),
        };
  
      case ACTIONS.DELETE_ENTRY:
        return {
          ...state,
          isEntriesLoading: false,
          entries: state.entries.filter(entry => entry.id !== action.id),
        };
  
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  
  export default reducer;
  