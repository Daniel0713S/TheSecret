import { useState } from 'react';

import { fetchSummary } from './services';


function DiaryEntryItem({ entry, onDeleteEntry, onUpdateEntry }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: entry.title, content: entry.content });
    const [isExpanded, setIsExpanded] = useState(false);

    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary('');
        setErrorMessage(''); // Reset error message before a new attempt
        try {
            const result = await fetchSummary(entry.content);
            setSummary(result.summary);
        } catch (error) {
            console.error("Error in handleSummarize:", error);
            if (error.error === 'quota-exceeded') {
                setErrorMessage("You have exceeded your OpenAI quota. Please check your plan and billing details.");
            } else {
                setErrorMessage("You have exceeded your OpenAI quota. Please check your plan and billing details.");
            }
        } finally {
            setIsSummarizing(false);
        }
    };


    const handleEditChange = (e) => {
        setErrorMessage('');
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

/*     const handleSave = () => {
        setErrorMessage('');
        onUpdateEntry(entry.id, editData);
        setIsEditing(false);
    };  */

    const handleSave = async () => {
        console.log('Saving entry with ID:', entry.id, 'and data:', editData);
        try {
          const updatedEntry = await onUpdateEntry(entry.id, editData);
          console.log('Updated entry received from server:', updatedEntry);
          
          setIsEditing(false);
          window.location.reload();
        } catch (error) {
          console.error('Failed to save:', error);
        }
    }; 
    
    const handleCancel = () => {
        setErrorMessage('');
        setEditData({ title: entry.title, content: entry.content });
        setIsEditing(false);
    };

    const toggleExpand = () => {
        setErrorMessage('');
        setIsExpanded(!isExpanded);  
    };

    const contentToShow = isExpanded || entry.content.length <= 75 ? entry.content : entry.content.substring(0, 75) + '...';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };

    return (
        <div className="entry">
            {isEditing ? (
                <>
                    <input
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        placeholder="Title"
                    />
                    <textarea
                        name="content"
                        value={editData.content}
                        onChange={handleEditChange}
                        placeholder="Write your diary here..."
                    />
                    <div className="button__group">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>    
                </>
            ) : (
                <>
                    <h3>{entry.title}</h3>
                    <p onClick={entry.content.length > 75 ? toggleExpand : undefined}>
                        {contentToShow}
                    </p>

                    
                    <div className="summary__container">
                        {summary && (
                            <div className="summary">
                                <h4>Summary:</h4>
                                <p>{summary}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="error">
                                <p style={{ color: 'red' }}>{errorMessage}</p>
                            </div>
                        )}

                    </div>


                    
                    <div className='date__info'>
                        <div>Created: {formatDate(entry.createdAt)}</div>
                        <div>Last Modified: {formatDate(entry.modifiedAt)}</div>
                    </div>
                    <div className='read__more__container'> 
                        {entry.content.length > 75 && (
                            <button onClick={toggleExpand} className='read__more__button'>{isExpanded ? 'Hide' : 'Read more'}</button>
                        )}
                    </div>
        
                    <div className="button__group">
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className="summarize__button"
                        >
                            {isSummarizing ? 'Summarizing...' : 'Summarize'}
                        </button>
                        <button onClick={() => onDeleteEntry(entry.id)}>Delete</button>
                    </div>    
                </>
            )}
        </div>
    );
}

export default DiaryEntryItem;
