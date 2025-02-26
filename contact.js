document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    // Verificar si los campos están vacíos
    if (!name || !message) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        console.log("Enviando mensaje con:", { name, message }); // Depuración

        // Realizar la solicitud POST al servidor
        const response = await fetch("https://ubiquitous-space-orbit-7vp7666w4q5vhp7rv-3000.app.github.dev/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, message }),
        });

        console.log("Respuesta del servidor:", response); // Ver respuesta del servidor

        // Si la respuesta es exitosa, procesamos la respuesta
        const result = await response.json();

        if (result.success) {
            alert("Mensaje enviado correctamente.");
            document.getElementById("contactForm").reset(); // Limpiar formulario
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        alert("Hubo un problema al enviar el mensaje.");
    }
});
