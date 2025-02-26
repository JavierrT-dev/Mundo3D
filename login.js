document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      if (result.role === "admin") {
        window.location.href = "admin.html"; // Redirigir al panel de administración
      } else {
        window.location.href = "index.html"; // Usuario normal
      }
    } else {
      alert(result.message || "Error al iniciar sesión.");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("Error de conexión con el servidor.");
  }
});
