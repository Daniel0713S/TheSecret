import DiaryEntryItem from './DiaryEntryItem';


function DiaryList({ entries, onDeleteEntry, onUpdateEntry }) {
    const sortedEntries = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortedEntries.length === 0) {
        return(
            <div className="entries__list">
                <h4>No diaries found. Add your first diary!</h4>
            </div>
        );
       
    };

    return (
        <div className="entries__list">
            {sortedEntries.map(entry => (
                <DiaryEntryItem
                    key={entry.id}
                    entry={entry}
                    onDeleteEntry={onDeleteEntry}
                    onUpdateEntry={onUpdateEntry}   
                />
            ))}
        </div>
    );
}

export default DiaryList;
