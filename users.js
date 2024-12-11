const { makeEntryList } = require('./entries');
const users = {};

function isValidUsername(username) {
/*     let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid; */
    return !!username && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
}

function getUserData(username) {
    if (!isValidUsername(username)) {
        throw new Error(`Invalid username: ${username}`);
    }
    if (!users[username]) {
        users[username] = makeEntryList();  
    }
    return users[username];
}
  
function addUserData(username, userData) {
    if (!isValidUsername(username)) {
        throw new Error(`Invalid username: ${username}`);
    }
    if (!users[username]) {
        users[username] = userData; 
    }
}


module.exports = {
    isValidUsername,
    getUserData,
    addUserData,
   
};