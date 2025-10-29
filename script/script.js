$(document).ready(function() {

// Consejos de usuarios
function initializeAdviceSystem() {
    // Cargar y mostrar consejos al iniciar
    displayLatestAdvices();
    
    // Configurar el formulario de consejos
    $(".tip-form").submit(function(event) {
        event.preventDefault();
        
        const title = $(this).find('input[type="text"]').val().trim();
        const description = $(this).find('textarea').val().trim();
        
        // Validar longitud
        if (title.length < 15) {
            alert("El título debe tener al menos 15 caracteres.");
            return;
        }
        
        if (description.length < 30) {
            alert("La descripción debe tener al menos 30 caracteres.");
            return;
        }
        
        // Añadir consejo
        addAdvice(title, description);
        
        // Limpiar formulario
        $(this).find('input[type="text"]').val('');
        $(this).find('textarea').val('');
        
    });
}

// Función para añadir un nuevo consejo
function addAdvice(title, description) {
    let adviceList = JSON.parse(localStorage.getItem("adviceList")) || [];
    
    // Crear nuevo consejo
    const newAdvice = {
        id: Date.now(), // ID único basado en timestamp
        title: title,
        description: description,
        date: new Date().toLocaleDateString('es-ES'),
        author: sessionStorage.getItem("loggedInUser") || "Anónimo"
    };
    
    // Añadir al principio de la lista
    adviceList.unshift(newAdvice);
    
    // Mantener solo los últimos 50 consejos para no sobrecargar localStorage
    if (adviceList.length > 50) {
        adviceList = adviceList.slice(0, 50);
    }
    
    // Guardar en localStorage
    localStorage.setItem("adviceList", JSON.stringify(adviceList));
    
    // Actualizar la visualización
    displayLatestAdvices();
}

// Función para mostrar los 3 últimos consejos
function displayLatestAdvices() {
    const adviceList = JSON.parse(localStorage.getItem("adviceList")) || [];
    const latestAdvices = adviceList.slice(0, 3); // Solo los 3 más recientes
    
    const adviceContainer = $(".tips ul");
    
    if (latestAdvices.length === 0) {
        adviceContainer.html('<li>No hay consejos todavía. ¡Sé el primero en compartir!</li>');
        return;
    }
    
    let adviceHTML = '';
    latestAdvices.forEach(advice => {
        adviceHTML += `
            <li class="advice-item">
                <a href="#" class="advice-link" data-advice-id="${advice.id}">
                    ${advice.title}
                </a>
                <span class="advice-date">${advice.date}</span>
            </li>
        `;
    });
    
    adviceContainer.html(adviceHTML);
    
    // Configurar clic en los consejos (para mostrar detalles)
    $(".advice-link").click(function(event) {
        event.preventDefault();
        const adviceId = $(this).data('advice-id');
        showAdviceDetails(adviceId);
    });
}

// Función para mostrar detalles completos de un consejo
function showAdviceDetails(adviceId) {
    const adviceList = JSON.parse(localStorage.getItem("adviceList")) || [];
    const advice = adviceList.find(a => a.id == adviceId);
    
    if (advice) {
        // Crear ventana modal con los detalles
        const modalHTML = `
            <div class="advice-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h3>${advice.title}</h3>
                    <p style="margin: 15px 0; line-height: 1.5;">${advice.description}</p>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                        font-size: 0.9em;
                        color: #666;
                    ">
                        <span>Publicado: ${advice.date}</span>
                        <span>Por: ${advice.author}</span>
                    </div>
                    <button onclick="$(this).closest('.advice-modal').remove()" 
                            style="
                                margin-top: 20px;
                                padding: 8px 16px;
                                background: var(--primary-color);
                                color: white;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                            ">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
    }
}

    // Control de acceso para loggedin
    if (window.location.pathname.includes("loggedin.html")) {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        
        if (!loggedInUser) {
            alert("Debe iniciar sesión para acceder a esta página.");
            window.location.href = "index.html";
            return;
        }
        
        // Mostrar datos del usuario
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        if (userData) {
            $(".user-info h3").text(`${userData.name} ${userData.surname}`);
            
            if (userData.profilePic) {
                $(".user-info .profile-pic").attr("src", userData.profilePic).show();
            }
        }

        // Sistema de consejos
        initializeAdviceSystem();

        // Cerrar sesión
        $(".user-info .btn").click(function(event) {
            event.preventDefault();
            
            if (confirm("¿Desea cerrar sesión?")) {
                sessionStorage.removeItem("loggedInUser");
                window.location.href = "index.html";
            }
        });
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
        if (!(/^[a-zA-Z]{5,}$/.test(login)) || (localStorage.getItem(login))) {
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
        console.log("Selected Pack ID:", selectedPackId); // Para debug

        if (selectedPackId && selectedPackId.length > 0) {
            // Busca el pack usando el ID
            const packData = travelPacks.find(pack => pack.id === selectedPackId);
            console.log("Pack encontrado:", packData); // Para debug

            if (packData) {
                // Actualiza el contenido de la página
                $("#purchase-pack-image").attr("src", packData.image).attr("alt", packData.alt);
                $("#purchase-pack-title").text(packData.title);
                $("#purchase-pack-short-description").text(packData.description);
                
                // Corregir la descripción completa - reemplazar el texto, no el HTML completo
                $("#purchase-pack-description p").text(packData.purchaseDescription);
                $("#purchase-pack-price").text(packData.price);
            } else {
                console.error("Pack no encontrado para ID:", selectedPackId);
                // Mostrar pack por defecto si no se encuentra
                showDefaultPack();
            }
        } else {
            console.log("No hay pack seleccionado, mostrando pack por defecto");
            showDefaultPack();
        }

        function showDefaultPack() {
            // Mostrar el primer pack como predeterminado
            const defaultPack = travelPacks[0];
            $("#purchase-pack-image").attr("src", defaultPack.image).attr("alt", defaultPack.alt);
            $("#purchase-pack-title").text(defaultPack.title);
            $("#purchase-pack-short-description").text(defaultPack.description);
            $("#purchase-pack-description p").text(defaultPack.purchaseDescription);
            $("#purchase-pack-price").text(defaultPack.price);
        }
    }
    
    // Validación del formulario de compra
    if ($(".purchase-form").length > 0) {

        // Validar formulario de compra
        $(".purchase-form form").submit(function(event) {
            event.preventDefault();
            
            let isValid = true;
            let errorMessage = "";

            // Obtener valores
            const fullname = $("input[name='fullname']").val().trim();
            const email = $("input[name='email']").val().trim();
            const cardType = $("#card-type").val();
            const cardNumber = $("input[name='card-number']").val().trim().replace(/\s/g, '');
            const cardholderName = $("input[name='cardholder-name']").val().trim();
            const expiryDate = $("input[name='expiry-date']").val();
            const cvv = $("input[name='cvv']").val().trim();

            // Validar Nombre completo (mínimo 3 caracteres)
            if (fullname.length < 3) {
                isValid = false;
                errorMessage += "- El nombre completo debe tener al menos 3 caracteres.\n";
            }

            // Validar Email (formato válido)
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage += "- El formato del email no es válido.\n";
            }

            // Validar Tipo de tarjeta (debe estar seleccionado)
            if (!cardType) {
                isValid = false;
                errorMessage += "- Debe seleccionar un tipo de tarjeta.\n";
            }

            // Validar Número de tarjeta (13, 15, 16 o 19 dígitos)
            const cardNumberRegex = /^\d{13}$|^\d{15}$|^\d{16}$|^\d{19}$/;
            if (!cardNumberRegex.test(cardNumber)) {
                isValid = false;
                errorMessage += "- El número de tarjeta debe tener 13, 15, 16 o 19 dígitos.\n";
            }

            // Validar Nombre del titular (mínimo 3 caracteres)
            if (cardholderName.length < 3) {
                isValid = false;
                errorMessage += "- El nombre del titular debe tener al menos 3 caracteres.\n";
            }

            // Validar Fecha de caducidad (no expirada)
            if (expiryDate) {
                const expiry = new Date(expiryDate + "-01"); // Añadir día para crear fecha completa
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (expiry < today) {
                    isValid = false;
                    errorMessage += "- La tarjeta está caducada.\n";
                }
            } else {
                isValid = false;
                errorMessage += "- La fecha de caducidad es obligatoria.\n";
            }

            // Validar CVV (3 dígitos)
            const cvvRegex = /^\d{3}$/;
            if (!cvvRegex.test(cvv)) {
                isValid = false;
                errorMessage += "- El CVV debe tener exactamente 3 dígitos.\n";
            }

            // Mostrar resultado
            if (isValid) {
                alert("¡Compra realizada con éxito!\nGracias por su compra.");
                // Aquí podrías redirigir a otra página o limpiar el formulario
                this.reset();
                // Corregir nuevamente el select después del reset
                $('#card-type').prepend('<option value="" selected disabled>Seleccione tipo de tarjeta</option>');
            } else {
                alert("Error en el formulario:\n" + errorMessage);
            }
        });

        // Validación en tiempo real para el número de tarjeta (formato visual)
        $("input[name='card-number']").on('input', function() {
            let value = $(this).val().replace(/\s/g, '').replace(/\D/g, '');
            // Formatear con espacios cada 4 dígitos
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            $(this).val(value);
        });

        // Validación en tiempo real para CVV (solo números)
        $("input[name='cvv']").on('input', function() {
            $(this).val($(this).val().replace(/\D/g, '').substring(0, 3));
        });
    }
})
