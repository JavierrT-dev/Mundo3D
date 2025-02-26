async function fetchUsers() {
  const response = await fetch("https://ubiquitous-space-orbit-7vp7666w4q5vhp7rv-3000.app.github.dev/users");
  const users = await response.json();

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="editUser(${user.id}, '${user.email}', '${user.role}')">Editar</button>
        <button onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function deleteUser(userId) {
  if (confirm("¿Seguro que quieres eliminar este usuario?")) {
    await fetch(`https://ubiquitous-space-orbit-7vp7666w4q5vhp7rv-3000.app.github.dev/users/${userId}`, {
      method: "DELETE",
    });
    fetchUsers(); // Recargar la lista después de eliminar
  }
}

// Función para cargar los datos del usuario en el formulario de edición
function editUser(id, email, role) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editEmail").value = email;
  document.getElementById("editRole").value = role;
  document.getElementById("editFormContainer").style.display = "block";
}

// Cancelar la edición
function cancelEdit() {
  document.getElementById("editFormContainer").style.display = "none";
}

// Manejar el envío del formulario de edición
document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = document.getElementById("editUserId").value;
  const newEmail = document.getElementById("editEmail").value;
  const newRole = document.getElementById("editRole").value;

  await fetch(`https://ubiquitous-space-orbit-7vp7666w4q5vhp7rv-3000.app.github.dev/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: newEmail, role: newRole }),
  });

  document.getElementById("editFormContainer").style.display = "none";
  fetchUsers(); // Recargar la lista
});

// Cargar los usuarios al abrir la página
fetchUsers();
