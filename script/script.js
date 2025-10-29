$(document).ready(function() {

    // Control de acceso para loggedin.html
    if (window.location.pathname.includes("loggedin.html")) {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        
        if (!loggedInUser) {
            alert("Debe iniciar sesión para acceder a esta página.");
            window.location.href = "index.html";
            return;
        }
        
        if (userData) {
            $(".user-info h3").text(`${userData.name} ${userData.surname}`);
            
            if (userData.profilePic) {
                $(".user-info .profile-pic").attr("src", userData.profilePic).show();
            }
        }

        // Cerrar sesión
        $(".user-info .btn").click(function(event) {
            event.preventDefault();
            
            if (confirm("¿Desea cerrar sesión?")) {
                sessionStorage.removeItem("loggedInUser");
                window.location.href = "index.html";
            }
        });
    }

        // Control de acceso y mostrar datos de usuario (loggedin.html)
    function checkAuthentication() {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
    
        if (!loggedInUser) {
            alert("Debe iniciar sesión para acceder a esta página.");
            window.location.href = "index.html";
            return null;
        }
    
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        if (!userData) {
            // Usuario no encontrado en localStorage
            sessionStorage.removeItem("loggedInUser");
            alert("Error en los datos de usuario. Por favor, inicie sesión nuevamente.");
            window.location.href = "index.html";
            return null;
        }
    
        return userData;
    }

    // Carrusel de imágenes
    
    const travelPacks = [
        {
            id: "sudeste_asiatico",
            image: "images/sudeste_asiatico.webp",
            alt: "Paisaje del Sudeste Asiático",
            title: "Pack Sudeste Asiático",
            description: "Vietnam & Camboya: buses, hostales y guía de visados.",
            price: "€600",
            purchaseDescription: "Embárcate en una aventura de 3 semanas por el corazón del Sudeste Asiático. Este pack cubre todos los transportes en autobús entre ciudades clave de Vietnam y Camboya, alojamiento en hostales seleccionados y una guía completa para la gestión de visados."
        },
        {
            id: "patagonia",
            image: "images/patagonia.jpg",
            alt: "Montañas en la Patagonia",
            title: "Aventura en la Patagonia",
            description: "Trekking por el sur de Argentina y Chile",
            price: "€850",
            purchaseDescription: "Explora los paisajes más impresionantes de la Patagonia con este pack de 15 días. Incluye rutas de trekking guiadas por el Parque Nacional Torres del Paine (Chile) y El Chaltén (Argentina), con todo el equipo de acampada necesario."
        },
        {
            id: "transiberiano",
            image: "images/transiberiano.jpg",
            alt: "Tren Transiberiano",
            title: "Ruta del Transiberiano",
            description: "El legendario viaje en tren de Moscú a Vladivostok.",
            price: "€1200",
            purchaseDescription: "Realiza el viaje en tren más largo del mundo. Este pack de 21 días te lleva de Moscú a Vladivostok, con paradas estratégicas en Ekaterimburgo y el Lago Baikal. Incluye todos los billetes de tren en segunda clase y tours guiados en las paradas."
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
                    <a href="purchase.html" class="btn buy-btn" data-pack-id="${pack.id}">Comprar</a>
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
    setInterval(function() {
        $(".right-arrow").click();
    }, 2000);

    // Guardar pack seleccionado
    $(document).on("click", ".buy-btn", function(event) {
        event.preventDefault(); // Evita que el enlace navegue inmediatamente
        const packId = $(this).data("pack-id"); // Obtenemos el id del pack mediante el atributo 'data-pack-id'
        sessionStorage.setItem("selectedPackId", packId); // Lo guardamos en sessionStorage
        window.location.href = $(this).attr("href"); // Navegamos hacia la página de compra
    });

    // Funcionalidad de login (Página Home - index.html)

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
        if (!(/^[a-zA-Z]{5,}$/.test(login)) || !(localStorage.getItem(login))) {
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

    // Página de compra
    if ($(".purchase-main-container").length > 0) {
        const selectedPackId = sessionStorage.getItem("selectedPackId");

        if (selectedPackId.length) {
            // Busca el pack usando el ID
            const packData = travelPacks.find(pack => pack.id === selectedPackId);
            console.log(packData.id);

            // Actualiza el contenido de la página
            $("#purchase-pack-image").attr("src", packData.image).attr("alt", packData.alt);
            $("#purchase-pack-title").text(packData.title);
            $("#purchase-pack-short-description").text(packData.description)
            $("#purchase-pack-description").text(packData.purchaseDescription);
            $("#purchase-pack-price").text(packData.price);
        }
    };
})
