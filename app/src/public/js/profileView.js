function verifyInputs() {
    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (username === '' || email === '') {
        return false;
    }

    return true;
}

function showNotification(message, type) {
    let notiDIV = document.getElementById('notification');
    let notiIcoDIV = document.getElementById('notification-icon-container');
    let notiIcon = document.getElementById('notification-icon');
    let notiText = document.getElementById('notification-message');

    let color = type === 'error' ? 'red' : type === 'success' ? 'blue' : 'orange';
    let icon = type === 'error' ? 'fa-times-circle' : type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    notiDIV.classList.add(`bg-${color}-500`, `border-${color}-700`);
    notiText.textContent = message;
    notiIcoDIV.classList.add(`bg-${color}-900`);
    notiIcon.classList.add(icon);
    notiDIV.classList.remove("hidden");

    setTimeout(() => {
        notiDIV.classList.add("hidden");
        notiDIV.classList.remove(`bg-${color}-500`, `border-${color}-700`);
        notiIcoDIV.classList.remove(`bg-${color}-900`);
        notiIcon.classList.remove(icon);
    }, 3000); // Ocultar después de 3 segundos
}

const updateButton = document.getElementById("update-btn");

document.getElementById('profile-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/v1/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ username, email }),
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(data.message, 'success');
        } else {
            console.error('Error:', data);
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ha ocurrido un error', 'error');
    }
});

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
        updateButton.disabled = !verifyInputs();
        if (updateButton.disabled) {
            updateButton.classList.replace("cursor-pointer", "cursor-not-allowed");
            updateButton.classList.remove("bg-blue-500", "hover:bg-blue-700");
            updateButton.classList.add("bg-gray-700");
        } else {
            updateButton.classList.replace("cursor-not-allowed", "cursor-pointer");
            updateButton.classList.remove("bg-gray-700");
            updateButton.classList.add("bg-blue-500", "hover:bg-blue-700");
        }
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch("/api/v1/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
        } else {
            localStorage.removeItem("token");
            location.href = '/login'; // Redirigir al login si no hay sesión válida
        }
    } else {
        location.href = '/login'; // Redirigir si no hay token
    }
});
