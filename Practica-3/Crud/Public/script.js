document.addEventListener("DOMContentLoaded", function () {
    const itemList = document.getElementById("itemList");
    const addForm = document.getElementById("addForm");
    let editId = null;

    // Función para cargar los elementos desde el servidor
    function loadItems() {
        fetch("/items")
            .then(response => response.json())
            .then(items => {
                itemList.innerHTML = "";
                items.forEach(item => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item");
                    li.innerHTML = `
                        ${item.nombre} - ${item.descripcion}
                        <button class="btn btn-warning btn-sm float-right ml-2 editBtn" data-id="${item.id}">Editar</button>
                        <button class="btn btn-danger btn-sm float-right deleteBtn" data-id="${item.id}">Borrar</button>
                    `;
                    itemList.appendChild(li);
                });

                // Agregar funcionalidad a los botones de edición y borrado
                document.querySelectorAll(".editBtn").forEach(button => {
                    button.addEventListener("click", (e) => {
                        const id = e.target.dataset.id;
                        const nombre = e.target.parentElement.childNodes[0].textContent.split(' - ')[0];
                        const descripcion = e.target.parentElement.childNodes[0].textContent.split(' - ')[1];

                        // Rellenar los campos de edición
                        document.getElementById("nombre").value = nombre;
                        document.getElementById("descripcion").value = descripcion;
                        editId = id;

                        // Cambiar el botón de Agregar a Editar
                        addForm.querySelector("button").textContent = "Actualizar";
                    });
                });

                document.querySelectorAll(".deleteBtn").forEach(button => {
                    button.addEventListener("click", (e) => {
                        const id = e.target.dataset.id;
                        deleteItem(id);
                    });
                });
            });
    }

    // Función para agregar o actualizar un elemento
    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;

        if (editId) {
            // Si editId tiene un valor, actualizar el item
            fetch(`/update/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion })
            }).then(() => {
                addForm.reset();
                editId = null;
                loadItems();
                addForm.querySelector("button").textContent = "Agregar"; // Reset botón
            }).catch((err) => console.log('Error actualizando:', err));
        } else {
            // Si no, agregar un nuevo item
            fetch("/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion })
            }).then(() => {
                addForm.reset();
                loadItems();
            }).catch((err) => console.log('Error agregando:', err));
        }
    });

    // Función para eliminar un elemento
    function deleteItem(id) {
        fetch(`/delete/${id}`, { method: "DELETE" })
            .then(() => {
                loadItems();
            }).catch((err) => console.log('Error eliminando:', err));
    }

    loadItems();
});
