document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  const noteModal = document.getElementById("note-modal");
  const noteTitle = document.getElementById("note-title");
  const noteContent = document.getElementById("note-content");
  const noteImage = document.getElementById("note-image");
  const saveNoteBtn = document.getElementById("save-note-btn");
  const previewBtn = document.getElementById("preview-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const previewContainer = document.getElementById("preview-container");
  const previewTitle = document.getElementById("preview-title");
  const previewContent = document.getElementById("preview-content");
  const previewImage = document.getElementById("preview-image");

  const loginBtn = document.getElementById("login-btn");
  const loginModal = document.getElementById("login-modal");
  const passwordInput = document.getElementById("password-input");
  const submitPasswordBtn = document.getElementById("submit-password-btn");
  const cancelLoginBtn = document.getElementById("cancel-login-btn");

  const PASSWORD = "MiContraseñaSegura"; // Cambia esta contraseña
  let isLoggedIn = false;

  loginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  submitPasswordBtn.addEventListener("click", () => {
    const userPassword = passwordInput.value.trim();
    if (userPassword === PASSWORD) {
      isLoggedIn = true;
      alert("Inicio de sesión exitoso.");
      loginModal.classList.add("hidden");
      document.getElementById("create-note-btn").classList.remove("hidden");
    } else {
      alert("Contraseña incorrecta.");
    }
  });

  cancelLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  const loadNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    newsContainer.innerHTML = "";
    notes.forEach(note => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("news-item");
      noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        ${note.image ? `<img src="${note.image}" alt="${note.title}" />` : ""}
        <button class="delete-note-btn" data-id="${note.id}">Eliminar Nota</button>
      `;
      newsContainer.appendChild(noteElement);
    });

    // Añadir eventos de eliminación a los botones
    document.querySelectorAll(".delete-note-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const noteId = e.target.dataset.id;
        const userPassword = prompt("Introduce la contraseña para eliminar:");
        if (userPassword === PASSWORD) {
          const notes = JSON.parse(localStorage.getItem("notes")) || [];
          const updatedNotes = notes.filter(note => note.id !== noteId);
          localStorage.setItem("notes", JSON.stringify(updatedNotes));
          loadNotes();
        } else {
          alert("Contraseña incorrecta.");
        }
      });
    });
  };

  // Mostrar vista previa
  previewBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const imageFile = noteImage.files[0];

    if (!title || !content) {
      alert("El título y el contenido son obligatorios.");
      return;
    }

    previewTitle.textContent = title;
    previewContent.textContent = content;

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.classList.remove("hidden");
      };
      reader.readAsDataURL(imageFile);
    } else {
      previewImage.src = "";
      previewImage.classList.add("hidden");
    }

    previewContainer.classList.remove("hidden");
  });

  // Guardar nota
  saveNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const imageFile = noteImage.files[0];

    if (!title || !content) {
      alert("El título y el contenido son obligatorios.");
      return;
    }

    let imageData = "";
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageData = e.target.result;
        saveNoteToLocalStorage(title, content, imageData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveNoteToLocalStorage(title, content, imageData);
    }
  });

  const saveNoteToLocalStorage = (title, content, image) => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      image,
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
    noteModal.classList.add("hidden");
    previewContainer.classList.add("hidden");
    noteTitle.value = "";
    noteContent.value = "";
    noteImage.value = "";
  };

  // Cancelar creación
  cancelBtn.addEventListener("click", () => {
    noteModal.classList.add("hidden");
    previewContainer.classList.add("hidden");
    noteTitle.value = "";
    noteContent.value = "";
    noteImage.value = "";
  });

  loadNotes();
});