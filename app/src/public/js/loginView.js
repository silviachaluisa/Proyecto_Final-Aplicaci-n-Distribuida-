function verifyInputs(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
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
            console.error('Error:', data);
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

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            location.href = "/view/chats";
        } else {
            localStorage.removeItem("token");
        }
    }
});