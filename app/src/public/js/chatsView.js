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

        // Agregar los chats cargados
        chats.forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.classList.add('flex', 'items-center', 'justify-between', 'w-full', 'p-4', 'border-b', 'rounded-lg', 
                                      'border-gray-300', 'dark:border-gray-100', 'dark:bg-gray-700', 
                                      'hover:bg-slate-800', 'dark:hover:bg-slate-800', 'cursor-pointer', "mr-4");

            chatElement.innerHTML = `
                <div class="w-14 h-14 bg-gray-300 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-900">
                    <i class="fa-solid ${chat.is_group ? "fa-user-group" : "fa-user"} text-gray-500 dark:text-gray-300 text-3xl"></i>
                </div>
                <p class="text-gray-800 dark:text-white font-semibold">${chat.name}</p>
                <button class="ml-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                    <i class="fa-solid fa-trash text-2xl"></i>
                </button>
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

document.getElementById('newChatBtn').addEventListener('click', openNewChatModal);
document.getElementById('refresh').addEventListener('click', getChats);
document.getElementById('logout').addEventListener('click', handleLogout);

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch("/api/v1/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        if (response.ok) {
            location.href = "/view/chats";
        } else {
            localStorage.removeItem("token");
            window.location.href = '/';
        }
    } else {
        window.location.href = '/';
    }
});

getChats();