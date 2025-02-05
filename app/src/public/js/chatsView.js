async function getChats() {
    const response = await fetch('/api/v1/chats', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const chats = await response.json();
    return chats;
}