function showNotification(errors, type) {
    let notiDIV = document.getElementById('notification');
    let notiIcoDIV = document.getElementById('notification-icon-container');
    let notiIcon = document.getElementById('notification-icon');
    let notiText = document.getElementById('notification-message');

    const colorClasses = {
        error: { bg: 'bg-red-500', border: 'border-red-700', iconBg: 'bg-red-900', icon: 'fa-times-circle' },
        success: { bg: 'bg-blue-500', border: 'border-blue-700', iconBg: 'bg-blue-900', icon: 'fa-check-circle' },
        warning: { bg: 'bg-orange-500', border: 'border-orange-700', iconBg: 'bg-orange-900', icon: 'fa-exclamation-circle' }
    };

    let { bg, border, iconBg, icon } = colorClasses[type] || colorClasses.warning;

    if (!Array.isArray(errors)) {
        errors = [errors];
    }

    let index = 0;

    function showNextError() {
        if (index >= errors.length) return;

        // Limpiar clases previas antes de agregar las nuevas
        notiDIV.classList.remove('bg-red-500', 'border-red-700', 'bg-blue-500', 'border-blue-700', 'bg-orange-500', 'border-orange-700');
        notiIcoDIV.classList.remove('bg-red-900', 'bg-blue-900', 'bg-orange-900');
        notiIcon.classList.remove('fa-times-circle', 'fa-check-circle', 'fa-exclamation-circle');

        // Agregar nuevas clases
        notiDIV.classList.add(bg, border);
        notiIcoDIV.classList.add(iconBg);
        notiIcon.classList.add(icon);
        notiText.textContent = errors[index]?.msg || errors[index];

        notiDIV.classList.remove("hidden");

        setTimeout(() => {
            notiDIV.classList.add("hidden");

            index++; 
            showNextError();
        }, 3000);
    }

    showNextError();
}

async function getChats() {
    const chatsContainer = document.getElementById('chats-container');
    chatsContainer.innerHTML = ''; // Limpiar contenido previo

    // Crear animación de carga
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add("animate-pulse", "flex", "flex-col", "items-center", "justify-center", "w-full", "gap-4");

    for (let i = 0; i < 5; i++) {
        const loadItem = document.createElement('div');
        loadItem.classList.add("flex", "items-center", "justify-between", "bg-gray-300", "rounded-lg", "p-10", "w-full", "h-10");
        loadItem.innerHTML = `
            <div class="w-14 h-14 bg-gray-400 rounded-full"></div>
            <div class="flex flex-col items-center justify-center">
                <div class="w-20 h-4 bg-gray-400 rounded-full"></div>
                <div class="w-16 h-4 bg-gray-400 rounded-full mt-2"></div>
            </div>
            <div class="flex flex-col items-center justify-center">
                <div class="w-4 h-4 bg-gray-400 rounded-full"></div>
                <div class="w-4 h-4 bg-gray-400 rounded-full mt-2"></div>
            </div>`;
        loadingContainer.appendChild(loadItem);
    }

    // Agregar la animación de carga al contenedor de chats
    chatsContainer.appendChild(loadingContainer);

    try {
        const response = await fetch('/api/v1/chats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const chats = await response.json();

        // Remover la animación de carga
        chatsContainer.innerHTML = '';

        // Si no tiene chats, mostrar mensaje
        if (chats.length === 0) {
            chatsContainer.innerHTML = `<p class="text-gray-500 font-semibold">No hay chats disponibles.</p>`;
            return;
        }

        // Agregar los chats cargados
        chats.forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.classList.add('flex', 'items-center', 'justify-eventy', 'w-full', 'p-3', 'border-b', 'rounded-lg', 
                                      'border-gray-300', 'dark:border-gray-100', 'dark:bg-gray-700', 
                                      'hover:bg-slate-800', 'dark:hover:bg-slate-800', 'cursor-pointer', "transition", "duration-300");
            
            chatElement.addEventListener('click', () => {
                getMessagesChat(chat); // Obtener los mensajes del chat
            });

            chatElement.innerHTML = `
                <div class="w-14 h-12 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
                    <i class="fa-solid ${chat.is_group ? "fa-user-group" : "fa-user"} text-gray-500 dark:text-gray-300 text-2xl"></i>
                </div>
                <div class="flex flex-col items-start justify-center w-full ml-4">
                    <p class="text-gray-800 dark:text-white font-semibold">${chat.name}</p>
                    <div class="flex flex-col md:flex-row items-end justify-between w-full">
                        <small class="text-gray-500 dark:text-gray-400">${chat.ownerUser.name}</small>
                        ${chat.is_group ? `<small class='text-gray-500 dark:text-gray-400'>${chat.nUsers} Usuarios</small>` : ""}
                        <small class="text-gray-500 dark:text-gray-400">${chat.is_group ? "Grupo" : "Chat"} ${chat.is_public ? "publico" : "privado"}</small>
                    </div>
                </div>
            `;
            chatsContainer.appendChild(chatElement);
        });

    } catch (error) {
        console.error("Error al obtener los chats:", error);
        chatsContainer.innerHTML = `<p class="text-red-500 font-semibold">Error al cargar los chats.</p>`;
    }
}

async function getMessagesChat(chatInfo) {
    console.log("Chat seleccionado:", chatInfo);
    if (!chatInfo.id) {
        showNotification('No se ha seleccionado un chat', 'error');
        return;
    }
    const chatsContainer = document.getElementById('chat-container');
    chatsContainer.scrollIntoView({ behavior: 'smooth' });

    try {
        chatsContainer.innerHTML = ''; // Limpiar contenido previo

        await getUsers(chatInfo.id); // Obtener los usuarios del chat
        const response = await fetch(`/api/v1/messages/${chatInfo.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const messages = await response.json();
            console.log("Mensajes:", messages);

            const currentUserID = localStorage.getItem('uid');

            // Mostrar la cabecera (Informacion como el nombre del chat) en la parte superior
            const chatHeader = document.createElement('div');
            chatHeader.classList.add('flex', 'items-center', 'justify-between', 'w-full', 'p-4', 'bg-gray-500', 'dark:bg-gray-700', 'rounded-t-lg');

            chatHeader.innerHTML = `
                <p class="text-white font-semibold">${chatInfo.name}</p>
                <div class="flex items-center justify-between gap-4">
                    ${chatInfo.is_group ? `
                    <button class="bg-gray-300 dark:bg-gray-400 text-white rounded-lg p-2 cursor-pointer">
                        <span>
                            <i class="fa-solid fa-user-group text-xl p-2 text-white"></i>
                        </span>
                    </button>` : ''}
                    
                    <button class="bg-red-500 dark:bg-red-700 text-white rounded-lg p-2 cursor-pointer">
                        <span>
                            <i class="fa-solid fa-times text-xl p-2 text-white"></i>
                        </span>
                    </button>
                </div>
            `;
            chatsContainer.appendChild(chatHeader);

            // Dar funcionalidad a los botones de la cabecera
            chatHeader.querySelector('button:last-child').addEventListener('click', handleCloseChat);
            chatHeader.querySelector('button:first-child').addEventListener('click', openListUsersModal);

            // Mostrar los mensajes en el chat
            const divMessages = document.createElement('div');
            divMessages.classList.add('flex', 'flex-col', 'items-start', 'justify-start', 'w-full', 'h-full', 'p-4', 'gap-4', 'overflow-y-auto', "bg-gray-300", "dark:bg-gray-900");

            messages.forEach(message => {
                if (message.sender.id === parseInt(currentUserID)) {
                    const divMessage = document.createElement('div');
                    divMessage.classList.add('flex', 'flex-col', 'items-end', 'justify-start', 'w-full', 'p-2');

                    divMessage.innerHTML = `
                    <div class="bg-blue-500 dark:bg-blue-700 p-3 rounded-tr-lg rounded-tl-lg rounded-bl-lg text-white">
                        <p class="text-white font-semibold">${message.sender.name}</p>
                        <p class="text-white">${message.content}</p>
                    </div>
                    `;
                    divMessages.appendChild(divMessage);
                    return;
                } 

                const divMessage = document.createElement('div');
                divMessage.classList.add('flex', 'flex-col', 'items-start', 'justify-start', 'w-full', 'p-2');

                divMessage.innerHTML = `
                    <div class="bg-gray-300 dark:bg-gray-700 p-3 rounded-tr-lg rounded-tl-lg rounded-br-lg text-gray-800 dark:text-white">
                        <p class="text-gray-800 dark:text-white font-semibold">${message.sender.name}</p>
                        <p class="text-gray-600 dark:text-gray-300">${message.content}</p>
                    </div>
                `;
                divMessages.appendChild(divMessage);
            });

            // Si no hay mensajes, mostrar mensaje
            if (messages.length === 0) {
                divMessages.innerHTML = `<p class="text-gray-500 font-semibold w-full h-full">No hay mensajes en este chat.</p>`;
            }

            // Crear el input para enviar mensajes
            const divInput = document.createElement('div');
            divInput.classList.add('flex', 'items-center', 'justify-between', 'w-full', 'p-2', 'bg-gray-500', 'dark:bg-gray-700', 'rounded-b-lg');

            divInput.innerHTML = `
                <input type="text" id="message-input" class="w-full p-2 m-2 bg-transparent dark:text-white" placeholder="Escribe un mensaje...">
                <button id="send-message" class="bg-blue-500 dark:bg-blue-700 text-white rounded-lg cursor-not-allowed" disabled>
                    <span>
                        <i class="fa-regular fa-paper-plane text-xl p-4 text-white"></i>
                    </span>
                </button>
            `;

            // Visualizar el ultimo mensaje (final del chat)
            requestAnimationFrame(() => {
                divMessages.scrollTop = divMessages.scrollHeight;
            });            

            // Dar funcionalidad al input de mensajes
            const inputMessage = divInput.querySelector('#message-input');
            inputMessage.addEventListener('input', () => {
                // Si tiene contenido, habilitar el boton, de lo contrario, deshabilitarlo
                const message = inputMessage.value;
                const sendMessageBtn = divInput.querySelector('#send-message');
                sendMessageBtn.disabled = !message;
                sendMessageBtn.classList.toggle('cursor-not-allowed', !message);
                sendMessageBtn.classList.toggle('cursor-pointer', message);
            });

            inputMessage.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    if (!inputMessage.value) return;
                    const sendMessageBtn = divInput.querySelector('#send-message');
                    sendMessageBtn.click();
                }
            });

            const sendMessageBtn = divInput.querySelector('#send-message');
            sendMessageBtn.addEventListener('click', () => {
                const messageInput = divInput.querySelector('#message-input');
                sendMessage(chatInfo, messageInput.value);
                messageInput.value = '';

                // Deshabilitar el botón de enviar
                sendMessageBtn.disabled = true;
                sendMessageBtn.classList.add('cursor-not-allowed');
                sendMessageBtn.classList.remove('cursor-pointer');
            });

            chatsContainer.appendChild(divMessages);
            chatsContainer.appendChild(divInput);
        } else {
            const data = await response.json();
            showNotification(data.message, 'error');

            chatsContainer.innerHTML = `<p class="text-red-500 font-semibold">Error al cargar los mensajes.</p>`;
        }
    } catch (error) {
        console.error("Error al obtener los mensajes:", error.message);
        showNotification('Error al obtener los mensajes', 'error');

        chatsContainer.innerHTML = `<p class="text-red-500 font-semibold">Error al cargar los mensajes.</p>`;
    }
}

async function getUsers(chatId) {
    const usersContainer = document.getElementById('users-list');
    usersContainer.innerHTML = ''; // Limpiar contenido previo

    try {
        const response = await fetch(`/api/v1/chat-users/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const users = await response.json();

        // Si no hay usuarios, mostrar mensaje
        if (users.length === 0) {
            usersContainer.innerHTML = `<p class="text-gray-500 font-semibold">No hay usuarios disponibles.</p>`;
            return;
        }

        // Agregar los usuarios cargados
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('flex', 'items-center', 'justify-eventy', 'w-full', 'p-3', 'border-b', 'rounded-lg', 
                                      'border-gray-300', 'dark:border-gray-100', 'dark:bg-gray-700', 
                                      'hover:bg-slate-800', 'dark:hover:bg-slate-800', 'cursor-pointer', "transition", "duration-300");
            
            userElement.addEventListener('click', () => {
                inviteUserToChat(chatId, user.id); // Invitar al usuario al chat
            });

            userElement.innerHTML = `
                <div class="w-14 h-12 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
                    <i class="fa-solid fa-user text-gray-500 dark:text-gray-300 text-2xl"></i>
                </div>
                <div class="flex flex-col items-start justify-center w-full ml-4">
                    <p class="text-gray-800 dark:text-white font-semibold">${user.name}</p>
                    <small class="text-gray-500 dark:text-gray-400">${user.email}</small>
                </div>
            `;
            usersContainer.appendChild(userElement);
        });

        // Agregar un separador entre los usuarios y la opción de invitar
        const separator = document.createElement('div');
        separator.classList.add('w-full', 'h-1', 'bg-gray-300', 'dark:bg-gray-700');
        usersContainer.appendChild(separator);

        // Agregar la opción de invitar a un usuario
        const DIVInvite = document.createElement('div');
        DIVInvite.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'w-full', 'p-4', 'bg-gray-500', 'dark:bg-gray-700', 'rounded-lg');

        DIVInvite.innerHTML = `
        <div class="bg-gray-300 dark:bg-slate-800 rounded-full flex p-3 items-center justify-center border-2 border-gray-300 dark:border-gray-900">
            <p class="text-white font-semibold">Invitar a un usuario</p>
            <i class="fa-solid fa-user-plus text-2xl text-white ml-2"></i>
        </div>

        
        <div class="grid grid-cols-[70%_30%] gap-4 w-full">
            <div class="flex flex-col items-start justify-start w-full p-2">
                <label for="email-invite" class="text-gray-800 dark:text-white font-semibold mt-4">Correo electrónico</label>
                <input type="email" id="email-invite" class="w-full p-2 mt-2 bg-transparent dark:text-white rounded-lg" placeholder="Ingresa el correo electrónico del usuario">
            </div>

            <div class="flex flex-col items-center justify-center w-full p-2">
                <button id="invite-user" class="bg-blue-500 dark:bg-blue-700 text-white rounded-lg p-2 cursor-not-allowed w-3/5" disabled>
                    <span>
                        <i class="fa-solid fa-user-plus text-xl p-2 text-white"></i>
                    </span>
                </button>
            </div>
        </div>
        `;
        DIVInvite.addEventListener('click', openListUsersModal);
        usersContainer.appendChild(DIVInvite);

        // Dar funcionalidad al botón de invitar
        const emailInput = DIVInvite.querySelector('#email-invite');
        emailInput.addEventListener('input', () => {
            // Si tiene contenido, habilitar el boton, de lo contrario, deshabilitarlo
            const email = emailInput.value;
            const inviteUserBtn = DIVInvite.querySelector('#invite-user');
            inviteUserBtn.disabled = !email;
            inviteUserBtn.classList.toggle('cursor-not-allowed', !email);
            inviteUserBtn.classList.toggle('cursor-pointer', email);
        });

        emailInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                if (!emailInput.value) return;
                const inviteUserBtn = DIVInvite.querySelector('#invite-user');
                inviteUserBtn.click();
            }
        });

        const inviteUserBtn = DIVInvite.querySelector('#invite-user');
        inviteUserBtn.addEventListener('click', () => {
            const emailInput = DIVInvite.querySelector('#email-invite');
            inviteUserToChat(chatId, emailInput.value);
            emailInput.value = '';

            // Deshabilitar el botón de invitar
            inviteUserBtn.disabled = true;
            inviteUserBtn.classList.add('cursor-not-allowed');
            inviteUserBtn.classList.remove('cursor-pointer');
        });

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        usersContainer.innerHTML = `<p class="text-red-500 font-semibold">Error al cargar los usuarios.</p>`;
    }
}

async function sendMessage(chatInfo, content) {
    if (!chatInfo.id || !content) {
        showNotification('Debes ingresar un mensaje', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/v1/send-message/${chatInfo.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            socket.emit('chat message', chatInfo); // Enviar el mensaje al chat
            showNotification('Mensaje enviado', 'success');
        } else {
            const data = await response.json();
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        showNotification('Error al enviar el mensaje', 'error');
    }
}

async function inviteUserToChat(chatId, userMail) {
    if (!chatId || !userMail) {
        showNotification('Debes seleccionar un chat y un usuario', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/v1/invite-user/${chatId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ user_email: userMail })
        });

        const data = await response.json();
        closeListUsersModal();

        if (response.ok) {
            showNotification(data.message, 'success');
            socket.emit('reload chats', { chat_id: chatId });
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        closeListUsersModal();
        console.error("Error al invitar al usuario:", error);
        showNotification('Error al invitar al usuario', 'error');
    }
}

function handleCloseChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center max-w-md">
        <div class="flex items-center justify-center bg-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-400 w-16 h-16">
            <i class="fa-solid fa-comments text-3xl text-black"></i>
        </div>
        <h1 class="text-3xl font-semibold text-gray-800 dark:text-white mt-4">
            Accede a un <span class="text-blue-500 uppercase">chat</span>
        </h1>
        <p class="text-gray-600 dark:text-white mt-2">
            Para acceder a un chat, selecciona uno de la lista de chats a la izquierda.
        </p>
    </div>
    `;
}

function openNewChatModal() {
    const modal = document.getElementById('newChatModal');
    modal.classList.remove('hidden');
}

function closeNewChatModal() {
    const modal = document.getElementById('newChatModal');
    modal.classList.add('hidden');
}

function openListUsersModal() {
    const modal = document.getElementById('usersModal');
    modal.classList.remove('hidden');
}

function closeListUsersModal() {
    const modal = document.getElementById('usersModal');
    modal.classList.add('hidden');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    window.location.href = '/';
}

const handleCreateChat = async () => {
    const chatName = document.getElementById('chat-name').value;
    const isGroup = document.getElementById('is-group').checked;
    const isPublic = document.getElementById('is-public').checked;

    if (!chatName) {
        showNotification('Debes ingresar un nombre para el chat', 'error');
        return;
    }

    try {
        const response = await fetch('/api/v1/create-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: chatName, is_group: isGroup, is_public: isPublic })
        });

        const data = await response.json();
        closeNewChatModal();
        if (response.ok) {
            showNotification('Chat creado exitosamente', 'success');
            socket.emit('reload chats', { name: chatName, is_group: isGroup });
        } else {
            showNotification(data.message, 'error');
        }

    } catch (error) {
        console.error("Error al crear el chat:", error);
        showNotification('Error al crear el chat', 'error');
    }
};

const socket = io(); // Conectar con el servidor WebSocket

socket.on("chat message", (data) => {
    console.log("Mensaje recibido:", data);
    getMessagesChat(data); // Actualizar los mensajes
});

socket.on("reload chats", (data) => {
    console.log("Nuevo chat:", data);

    getChats(); // Actualizar la lista de chats
});

function enviarMensaje() {
    socket.emit("chat message", "Hola desde el cliente");
}

document.getElementById('newChatBtn').addEventListener('click', openNewChatModal);
document.getElementById('refresh').addEventListener('click', getChats);
document.getElementById('logout').addEventListener('click', handleLogout);
document.getElementById('create-chat').addEventListener('click', handleCreateChat);

document.getElementById('is-group').addEventListener('change', function () {
    const isGroup = this.checked;
    const GroupPublic = document.getElementById('group-public');
    GroupPublic.classList.toggle('hidden', !isGroup);

    const isPublic = document.getElementById('is-public');
    if (!isGroup) {
        isPublic.checked = false;
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (token) {
        try {
            const response = await fetch("/api/v1/user", {
                headers: { 
                    Authorization: `Bearer ${token}`
                },
                method: "GET",
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("uid");
                window.location.href = '/';
                return;
            }

            const profile = await response.json();
            document.getElementById('profile-name').textContent = profile.name;
            localStorage.setItem('uid', profile.id);

            // Solo redirige si NO estamos ya en /view/chats
            if (currentPath !== "/view/chats") {
                window.location.href = "/view/chats";
            }
        } catch (error) {
            console.error("Error al verificar autenticación:", error.message);
            localStorage.removeItem("token");
            localStorage.removeItem("uid");
            window.location.href = '/view/login';
        }
    } else {
        if (currentPath !== "/view/login") {
            window.location.href = '/view/login';
        }
    }
});

getChats();