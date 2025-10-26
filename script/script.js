$(document).ready(function() {

    // Carrusel de imágenes
    
    const travelPacks = [
        {
            image: "images/sudeste_asiatico.webp",
            alt: "Paisaje del Sudeste Asiático",
            title: "Pack Sudeste Asiático",
            description: "Vietnam & Camboya: buses, hostales y guía de visados.",
            price: "€600",
            link: "purchase.html"
        },
        {
            image: "images/patagonia.jpg",
            alt: "Montañas en la Patagonia",
            title: "Aventura en la Patagonia",
            description: "Trekking por el sur de Argentina y Chile",
            price: "€850",
            link: "purchase.html"
        },
        {
            image: "images/transiberiano.jpg",
            alt: "Tren Transiberiano",
            title: "Ruta del Transiberiano",
            description: "El legendario viaje en tren de Moscú a Vladivostok.",
            price: "€1200",
            link: "purchase.html"
        }
    ];

    let currentPackIndex = 0;

    function showTravelPack(index) {
        const pack = travelPacks[index];
        const travelPackContainer = $(".travel-pack");

        // Usamos efectos de fade para la transición
        travelPackContainer.fadeOut(400, function() {
            $(this).html(`
                <img src="${pack.image}" alt="${pack.alt}">
                <div class="pack-info">
                    <h3>${pack.title}</h3>
                    <p>${pack.description}</p>
                </div>
                <div class="pack-purchase">
                    <span class="price">${pack.price}</span>
                    <a href="${pack.link}" class="btn">Comprar</a>
                </div>
            `).fadeIn(400);
        });
    }

    // Navegación manual del carrusel
    $(".right-arrow").click(function() {
        currentPackIndex = (currentPackIndex + 1) % travelPacks.length;
        showTravelPack(currentPackIndex);
    });

    $(".left-arrow").click(function() {
        currentPackIndex = (currentPackIndex - 1 + travelPacks.length) % travelPacks.length;
        showTravelPack(currentPackIndex);
    });

    // Navegación automática del carrusel
    let carouselInterval = setInterval(function() {
        $(".right-arrow").click();
    }, 2000);

    // --- FUNCIONALIDAD DE LOGIN (Página Home - index.html) ---

    $(".login-form").submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const username = $("#username").val();
        const password = $("#password").val();

        // Buscamos al usuario en localStorage
        const userData = JSON.parse(localStorage.getItem(username));

        if (userData && userData.password === password) {
            alert("¡Sesión iniciada con éxito!")
            // Guardamos el usuario logueado para mostrarlo en la otra página
            sessionStorage.setItem("loggedInUser", username);
            window.location.href = "loggedin.html"; // Redirigir a la página de usuario logueado
        } else {
            alert("Error: Usuario o contraseña incorrectos.");
        }
    });

    // Funcionalidad de registro

    const registrationForm = $(".registration-form");
    const saveButton = registrationForm.find(".btn");
    let profilePicBase64 = null; // Variable para almacenar la imagen en base64

    // Función para validar el formulario completo
    function validateForm() {
        let isValid = true;

        // Nombre: al menos 3 caracteres
        const name = $("input[name='name']").val();
        if (!/^\s*\w{3,}\s*$/.test(name)) {
            isValid = false;
        }

        // Apellidos: al menos 2 cadenas de al menos 3 caracteres
        const surname = $("input[name='surname']").val();
        if (!/^\s*\w{3,}\s+\w{3,}(\s+\w{3,})*\s*$/.test(surname)) {
            isValid = false;
        }

        // Correo: formato válido
        const email = $("input[name='email']").val();
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            isValid = false;
        }

        // Confirmar correo: debe coincidir con el de arriba
        const confirmEmail = $("input[name='confirm-email']").val();
        if (email !== confirmEmail) {
            isValid = false;
        }

        // Fecha de nacimiento: mayor de 18 años y menor de 130 años
        const birthdate = new Date($("input[name='birthdate']").val());
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }
        if (age < 18 || age > 130) {
            isValid = false;
        }

        // Login: al menos 5 caracteres
        const login = $("input[name='login']").val();
        if (login.length < 5 || localStorage.getItem(login)) {
            isValid = false;
        }

        // Contraseña: al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
        const password = $("input[name='password']").val();
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            isValid = false;
        }

        // Imagen: extensión .jpg, .jpeg, .png o .gif
        const filename = $("#profile-pic").val();
        if (!/^.+\.(jpg|jpeg|png|gif)$/i.test(filename)) {
            isValid = false;
        }

        // Checkbox de términos
        if (!$("#accept-terms").is(":checked")) {
            isValid = false;
        }

        // Habilitar o deshabilitar el botón de guardar
        if (isValid) {
            saveButton.prop("disabled", false);
        } else {
            saveButton.prop("disabled", true);
        }
    }

    // Llama a la validación en cada cambio de los inputs
    registrationForm.on("input change", "input", validateForm);

    // Convertir imagen a Base64 para poder almacenarla
    $("#profile-pic").change(function() {
        const file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            profilePicBase64 = null;
        }
    });

    // Guardar datos del registro
    registrationForm.submit(function(event) {
        event.preventDefault();

        const userData = {
            name: $("input[name='name']").val(),
            surname: $("input[name='surname']").val(),
            email: $("input[name='email']").val(),
            birthdate: $("input[name='birthdate']").val(),
            login: $("input[name='login']").val(),
            password: $("input[name='password']").val(),
            profilePic: profilePicBase64
        };

        // Guardamos en localStorage usando el login como clave
        localStorage.setItem(userData.login, JSON.stringify(userData));

        // Guardamos el usuario logueado para mostrarlo en la otra página
        sessionStorage.setItem("loggedInUser", userData.login);

        alert("¡Registro completado con éxito!");
        window.location.href = "loggedin.html";
    });

    // Estado inicial del botón
    validateForm();

})
