function verifyInputs() {
    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (username === '' || email === '') {
        return false;
    }

    return true;
}

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
            location.href = '/view/login'; // Redirigir al login si no hay sesión válida
        }
    } else {
        location.href = '/view/login'; // Redirigir si no hay token
    }
});
