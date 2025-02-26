const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const prisma = require("@prisma/client");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración para servir archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// Prisma Client
const prismaClient = new prisma.PrismaClient();

// 🟢 Ruta de Registro de Usuarios
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Correo ya registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user", // Se registra como usuario normal por defecto
      },
    });

    res.json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ success: false, message: "Error al registrar el usuario." });
  }
});

//  Ruta de Inicio de Sesión
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Contraseña incorrecta." });
    }

    // Enviar la información del usuario junto con su rol
    res.json({ success: true, message: "Inicio de sesión exitoso.", role: user.role });

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ success: false, message: "Error en el inicio de sesión." });
  }
});

//  Ruta para Obtener la Lista de Usuarios (Solo para Admin)
app.get("/users", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

//  Ruta para Eliminar Usuarios (Solo Admin)
app.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await prismaClient.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario." });
  }
});

//  Ruta para Editar Usuarios (Solo Admin)
app.put("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { email, role } = req.body;

  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { email, role },
    });

    res.json({ message: "Usuario actualizado correctamente.", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario." });
  }
});

//  Ruta para Guardar Mensajes de Contacto en la Base de Datos
app.post("/contact", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ success: false, message: "Por favor, completa todos los campos." });
  }

  try {
    const newMessage = await prismaClient.message.create({
      data: {
        name,
        message,
      },
    });

    console.log("Mensaje guardado en la base de datos:", newMessage);

    res.json({ success: true, message: "Mensaje enviado correctamente." });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    res.status(500).json({ success: false, message: "Hubo un problema al guardar el mensaje." });
  }
});

//  Ruta para Editar Usuarios (Solo Admin)
app.put("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { email, role } = req.body;

  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { email, role },
    });

    res.json({ message: "Usuario actualizado correctamente.", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario." });
  }
});


// 🟢 Servir Archivos HTML Estáticos
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// 🟢 Iniciar el Servidor
app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor corriendo en el puerto 3000");
});
