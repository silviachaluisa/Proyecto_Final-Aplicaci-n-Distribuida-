function showNotification(errors, type) {
    // Notificaciones del servidor
    let notiDIV = document.getElementById('notification');
    let notiIcoDIV = document.getElementById('notification-icon-container');
    let notiIcon = document.getElementById('notification-icon');
    let notiText = document.getElementById('notification-message');

    let color = type === 'error' ? 'red' : type === 'success' ? 'blue' : 'orange';
    let icon = type === 'error' ? 'fa-times-circle' : type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    if (!Array.isArray(errors)) {
        errors = [errors]; // Convertimos a array si no lo es
    }

    let index = 0;

    function showNextError() {
        if (index >= errors.length) return; // Si no hay más errores, detener

        notiDIV.classList.add(`bg-${color}-500`, `border-${color}-700`);
        notiText.textContent = errors[index]?.msg || errors[index];
        notiIcoDIV.classList.add(`bg-${color}-900`);
        notiIcon.classList.add(icon);
        notiDIV.classList.remove("hidden");

        setTimeout(() => {
            notiDIV.classList.add("hidden");
            notiDIV.classList.remove(`bg-${color}-500`, `border-${color}-700`);
            notiIcoDIV.classList.remove(`bg-${color}-900`);
            notiIcon.classList.remove(icon);
            
            index++; // Pasar al siguiente error
            showNextError(); // Llamar a la función nuevamente después de ocultar
        }, 3000); // Cada error se mostrará durante 3 segundos
    }

    showNextError(); // Iniciar la secuencia
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
            chatElement.classList.add('flex', 'items-center', 'justify-eventy', 'w-full', 'p-4', 'border-b', 'rounded-lg', 
                                      'border-gray-300', 'dark:border-gray-100', 'dark:bg-gray-700', 
                                      'hover:bg-slate-800', 'dark:hover:bg-slate-800', 'cursor-pointer', "mr-4");

            chatElement.innerHTML = `
                <div class="w-14 h-14 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
                    <i class="fa-solid ${chat.is_group ? "fa-user-group" : "fa-user"} text-gray-500 dark:text-gray-300 text-3xl"></i>
                </div>
                <p class="text-gray-800 dark:text-white font-semibold ml-4">${chat.name}</p>
            `;
            chatsContainer.appendChild(chatElement);
        });

    } catch (error) {
        console.error("Error al obtener los chats:", error);
        chatsContainer.innerHTML = `<p class="text-red-500">Error al cargar los chats.</p>`;
    }
}

function openNewChatModal() {
    const modal = document.getElementById('newChatModal');
    modal.classList.remove('hidden');
}

function closeNewChatModal() {
    const modal = document.getElementById('newChatModal');
    modal.classList.add('hidden');
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

const handleCreateChat = async () => {
    const chatName = document.getElementById('chat-name').value;
    const isGroup = document.getElementById('is-group').checked;

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
            body: JSON.stringify({ name: chatName, is_group: isGroup })
        });

        if (response.ok) {
            showNotification('Chat creado exitosamente', 'success');

            setTimeout(() => {
                closeNewChatModal();
                socket.emit('create chat', { name: chatName, is_group: isGroup });
            }, 3000);
        } else {
            const data = await response.json();
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
});

socket.on("new chat", (data) => {
    console.log("Nuevo chat:", data);

    const chatsContainer = document.getElementById('chats-container');
    const chatElement = document.createElement('div');
    chatElement.classList.add('flex', 'items-center', 'justify-eventy', 'w-full', 'p-4', 'border-b', 'rounded-lg', "dark:border-gray-100", "dark:bg-gray-700", "hover:bg-slate-800", "dark:hover:bg-slate-800", "mr-4");

    chatElement.innerHTML = `
        <div class="w-14 h-14 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
            <i class="fa-solid ${data.is_group ? "fa-user-group" : "fa-user"} text-gray-500 dark:text-gray-300 text-3xl"></i>
        </div>
        <p class="text-gray-800 dark:text-white font-semibold ml-4">${data.name}</p>
    `;
    chatsContainer.appendChild(chatElement);
});

function enviarMensaje() {
    socket.emit("chat message", "Hola desde el cliente");
}

document.getElementById('newChatBtn').addEventListener('click', openNewChatModal);
document.getElementById('refresh').addEventListener('click', getChats);
document.getElementById('logout').addEventListener('click', handleLogout);
document.getElementById('create-chat').addEventListener('click', handleCreateChat);

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (token) {
        try {
            const response = await fetch("/api/v1/user", {
                headers: { Authorization: `Bearer ${token}` },
                method: "GET",
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                window.location.href = '/';
                return;
            }

            const profile = await response.json();
            document.getElementById('profile-name').textContent = profile.name;

            // Solo redirige si NO estamos ya en /view/chats
            if (currentPath !== "/view/chats") {
                window.location.href = "/view/chats";
            }
        } catch (error) {
            console.error("Error al verificar autenticación:", error);
            window.location.href = '/';
        }
    } else {
        if (currentPath !== "/") {
            window.location.href = '/';
        }
    }
});

getChats();