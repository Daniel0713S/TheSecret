
function Loading({ className='loading', children='Loading...' }) {
    return (
        <div className={className}>
            <div className="spinner"></div> 
            <div>{children}</div> 
        </div>
    );
}

export default Loading;