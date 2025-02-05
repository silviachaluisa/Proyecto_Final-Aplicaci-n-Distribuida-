function verifyInputs(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        return false;
    }

    return true;
}

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

const loginButton = document.getElementById("login-btn");

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            localStorage.setItem('token', data.token);
            showNotification(data.message, 'success');

            setTimeout(() => {
                location.href = '/view/chats';
            }, 3000);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ha ocurrido un error', 'error');
    }
});

document.getElementById("toggle-pass").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordInput.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
    }
});

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
        // Habilitar o deshabilitar el botón de registro
        loginButton.disabled = !verifyInputs();
        if (loginButton.disabled) {
            loginButton.classList.replace("cursor-pointer", "cursor-not-allowed");
            loginButton.classList.remove("bg-blue-500", "hover:bg-blue-700");
            loginButton.classList.add("bg-gray-700");
        } else {
            loginButton.classList.replace("cursor-not-allowed", "cursor-pointer");
            loginButton.classList.remove("bg-gray-700");
            loginButton.classList.add("bg-blue-500", "hover:bg-blue-700");
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

        if (response.ok) {
            location.href = "/view/chats";
        } else {
            localStorage.removeItem("token");
        }
    }
});