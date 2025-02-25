document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Registro exitoso, por favor inicia sesión.");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
  