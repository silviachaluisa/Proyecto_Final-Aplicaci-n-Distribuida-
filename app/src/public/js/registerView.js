function checkPasswordStrength(password) {
    let strength = 0;

    // Validaciones de seguridad
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[!@#$%^&*()]/)) strength++;

    const strengthLevels = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];

    // No permitir que stregth sea mayor a 4
    if (strength > 4) strength = 4;

    return {
        level: strength,
        value: strength * 25, // Hace que la barra vaya de 0% a 100%
        text: strengthLevels[strength],
    };
}

function verifyInputs(){
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const Cpassword = document.getElementById('Cpassword').value;

    if (name === '' || email === '' || password === '' || Cpassword === '') {
        return false;
    }

    if (password !== Cpassword) {
        return false;
    }

    if (checkPasswordStrength(new String(password)).level < 2) {
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

const registerButton = document.getElementById("register-btn");

document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const Cpassword = document.getElementById('Cpassword').value;

    if (name === '' || email === '' || password === '' || Cpassword === '') {
        showNotification('Faltan campos por llenar', 'warning');
        return;
    }

    if (password !== Cpassword) {
        showNotification('Las contraseñas no coinciden', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/v1/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            showNotification(data.message, 'success');
            setTimeout(() => {
                location.href = '/view/login'; // Redirigir al usuario a la página de inicio de sesión
            }, 3000);
        } else {
            console.log(data);
            showNotification(
                data.message || data.errors, 
                data?.message ? 'warning' : 'error'
            );
        }
    } catch (error) {
        console.error(error);
        showNotification('Ocurrió un error', 'error');
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

document.getElementById("toggle-pass-2").addEventListener("click", function () {
    const passwordInput = document.getElementById("Cpassword");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordInput.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
    }
});

document.getElementById("password").addEventListener("input", function () {
    const password = this.value;
    const strengthText = document.getElementById("password-strength-text");
    const strengthMeter = document.getElementById("password-strength-meter");

    const strength = checkPasswordStrength(password);

    // Actualiza el texto
    strengthText.textContent = `Seguridad: ${strength.text}`;

    // Actualiza el ancho de la barra de progreso
    strengthMeter.style.width = `${strength.value}%`;

    // Cambia el color de la barra según la fuerza
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500"];
    strengthMeter.className = `h-full rounded-full transition-all duration-300 ${colors[strength.level]}`;
});

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
        // Habilitar o deshabilitar el botón de registro
        registerButton.disabled = !verifyInputs();
        if (registerButton.disabled) {
            registerButton.classList.replace("cursor-pointer", "cursor-not-allowed");
            registerButton.classList.remove("bg-blue-500", "hover:bg-blue-700");
            registerButton.classList.add("bg-gray-700");
        } else {
            registerButton.classList.replace("cursor-not-allowed", "cursor-pointer");
            registerButton.classList.remove("bg-gray-700");
            registerButton.classList.add("bg-blue-500", "hover:bg-blue-700");
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