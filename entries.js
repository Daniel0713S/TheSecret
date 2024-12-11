const uuid = require('uuid').v4;

function makeEntryList() {
    const entries = {};

    function addEntry(title, content) {
        const id = uuid();
        const timestamp = new Date().toISOString();
        entries[id] = { id, title, content, createdAt: timestamp, modifiedAt: timestamp };
        return id;
    }

    function getEntry(id) {
        return entries[id];
    }

    function updateEntry(id, updates) {
        const entry = entries[id];
        if (!entry) {
            return null;
        }
        if (updates.title !== undefined) {
            entry.title = updates.title;
        }
        if (updates.content !== undefined) {
            entry.content = updates.content;
        }
       
        entry.modifiedAt = new Date().toISOString();
        return entry;
    }

    function deleteEntry(id) {
        delete entries[id];
    }

    function getEntries() {
        return Object.values(entries); 
    }

    function contains(id) {
        return !!entries[id];
    }

    return {
        addEntry,
        getEntry,
        updateEntry,
        deleteEntry,
        getEntries,
        contains,
    };
}

module.exports = {
    makeEntryList,
};
