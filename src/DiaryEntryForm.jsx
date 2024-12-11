import { useState, useEffect } from 'react';

function DiaryEntryForm({ onAddEntry, onUpdateEntry, initialEntry = null }) {
    const [entry, setEntry] = useState({ title: '', content: '' });

    useEffect(() => {
        if (initialEntry) {
            
            setEntry(initialEntry);
        }
    }, [initialEntry]);

    function handleChange(e) {
        const { name, value } = e.target;
        setEntry(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // Validate input fields
        if (!entry.title.trim() || !entry.content.trim()) {
            console.error("Title and content cannot be empty");
            alert("Please provide both title and content.");
            return;
        }
        
/*         if (entry._id) {
            //onUpdateEntry(entry);
            onUpdateEntry(entry._id, { title: entry.title.trim(), content: entry.content.trim() });
        } else {
            //onAddEntry(entry);
            onAddEntry(entry.title.trim(), entry.content.trim());
        }
        setEntry({ title: '', content: '' }); */
        try {
            if (entry.id) {
                await onUpdateEntry(entry.id, { title: entry.title.trim(), content: entry.content.trim() });
            } else {
                await onAddEntry(entry.title.trim(), entry.content.trim());
            }
            setEntry({ title: '', content: '' }); // Reset only after successful operation
        } catch (error) {
            console.error("Failed to save entry:", error);
            alert("Failed to save entry. Please try again.");
        }
    }

    return (
        <form className="entry__form" onSubmit={handleSubmit}>
            <input
                name="title"
                value={entry.title}
                onChange={handleChange}
                placeholder="Title"
                className="entry__title"
            />
            <textarea
                name="content"
                value={entry.content}
                onChange={handleChange}
                placeholder="Write your diary here..."
                className="entry__content"
            />
            <button type="submit" className="entry__submit">Post</button>
            
        </form>
    );
}

export default DiaryEntryForm;
