import {fetchAndRenderCurrentUser} from "./user-core.js";
import {availableRoles} from "./roles.js";

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderUsers().catch(renderUsersError => console.log(renderUsersError));
    fetchAndRenderCurrentUser().catch(currentUserError => console.log(currentUserError));
    addFormListeners();
});

async function fetchAndRenderUsers() {
    try {
        const response = await fetch("/api/users");

        const users = await response.json();

        console.log('Полученные пользователи:', users);

        renderUsersTable(users);

    } catch (error) {
        console.error("Could not fetch users:", error);
    }
}

function renderUsersTable(users) {
    const usersBlock = document.getElementById("usersBlock");
    usersBlock.innerHTML = `
        <div class="d-flex align-items-center border-top p-3 ps-2">
            <h5 class="mb-0 fw-semibold col-1">ID</h5>
            <h5 class="mb-0 fw-semibold col-2">First Name</h5>
            <h5 class="mb-0 fw-semibold col-2">Last Name</h5>
            <h5 class="mb-0 fw-semibold col-1">Age</h5>
            <h5 class="mb-0 fw-semibold col-2">Email</h5>
            <h5 class="mb-0 fw-semibold col-2">Role</h5>
            <h5 class="mb-0 fw-semibold col-1">Edit</h5>
            <h5 class="mb-0 fw-semibold col-1">Delete</h5>
        </div>
    `

    for (let i = 0; i < users.length; i++) {
        const availableUserBlock = document.createElement("div");
        availableUserBlock.classList.add("d-flex", "align-items-center", "border-top", "p-3", "ps-2", "availableUserBlock");

        const fieldNames = ["idBlock", "firstName", "lastName", "age", "email", "role"],
            elementsArr = fieldNames.map(elem => document.createElement("p"));
        elementsArr.forEach(el => {
            el.classList.add("mb-0", "text-break");
        });

        const [idBlock, firstName, lastName, age, email, role] = elementsArr;
        idBlock.classList.add("col-1");
        idBlock.innerText = users[i].id
        firstName.classList.add("col-2");
        firstName.innerText = users[i].firstName;
        lastName.classList.add("col-2");
        lastName.innerText = users[i].surname;
        age.classList.add("col-1");
        age.innerText = users[i].age;
        email.classList.add("col-2");
        email.innerText = users[i].email;

        role.classList.add("col-2");
        for (let j = 0; j < users[i].roles.length; j++) {
            const span = document.createElement("span");
            span.classList.add("me-2");
            span.innerText = users[i].roles[j].roleName;
            role.append(span);
        }

        const editButton = document.createElement("button"),
            deleteButton = document.createElement("button");
        editButton.classList.add("btn", "btn-info", "text-white", "col-1", "flex-grow-0");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editModal");
        editButton.setAttribute("data-user-id", users[i].id);
        // console.log("Edit Button with id " + users[i].id + " was created");
        editButton.innerText = "Edit";
        deleteButton.classList.add("btn", "btn-danger", "col-1", "flex-grow-0", "ms-4", "text-break");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteModal");
        deleteButton.setAttribute("data-user-id", users[i].id);
        deleteButton.innerText = "Delete";

        availableUserBlock.append(idBlock, firstName, lastName, age, email, role, editButton, deleteButton);
        usersBlock.append(availableUserBlock);
    }

    usersBlock.addEventListener("click", (event) => {
        const target = event.target;

        if (target.hasAttribute("data-bs-target") && target.hasAttribute("data-user-id")) {
            const userId = target.getAttribute("data-user-id");
            const modalName = target.getAttribute("data-bs-target");
            showModalData(userId, modalName).catch(modalError => console.log(modalError));
        }
    });
}

async function showModalData(id, modalName) {
    try {
        const response = await fetch(`/api/users/${id}`);

        const user = await response.json();

        console.log('Полученный пользователь:', user);

        modalData(user, modalName);

    } catch (error) {
        console.error("Could not fetch user:", error);
    }
}

function modalData(user, modalName) {

    const modal = document.querySelector(`${modalName}`),
        modalId = modal.querySelector("input[name='id']"),
        modalFName = modal.querySelector("input[name='firstName']"),
        modalLName = modal.querySelector("input[name='lastName']"),
        modalAge = modal.querySelector("input[name='age']"),
        modalEmail = modal.querySelector("input[name='email']"),
        modalRole = modal.querySelector("select[name='role']");

    modalId.value = user.id;
    modalFName.value = user.firstName;
    modalLName.value = user.surname;
    modalAge.value = user.age;
    modalEmail.value = user.email;

    if (modal.id === "editModal") {
        modalRoles(user, false).catch(err => console.log(err));
    } else {
        modalRoles(user, true).catch(err => console.log(err));
    }

    async function modalRoles(user, userRolesOrNot) {
        try {
            const roles = await availableRoles();
            modalRoleRender(roles, user, userRolesOrNot);
        } catch (error) {
            console.error(error);
        }
    }

    function modalRoleRender(roles, user, userRolesOrNot) {
        let data;
        if (!userRolesOrNot) {
            data = roles;
            console.log("Db data is " + data);
        } else {
            data = user.roles;
            console.log("User roles is " + data);
        }
        modalRole.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            const option = document.createElement("option");
            if (userRolesOrNot) {
                option.classList.add("text-body")
            } else {
                option.classList.add("text-body-secondary")
            }
            option.innerText = data[i].roleName;
            modalRole.append(option);
        }

    }

}

function addFormListeners() {
    const editForm = document.querySelector("#editForm"),
        deleteForm = document.querySelector("#deleteForm"),
        addForm = document.querySelector("#addForm");

    if (editForm) {
        editForm.addEventListener("submit", (event) => {
            event.preventDefault();
            editUserData(editForm).catch(editUserDataError => console.log(editUserDataError));
        })
    }

    if (deleteForm) {
        deleteForm.addEventListener("submit", (event) => {
            event.preventDefault();
            deleteUserData(deleteForm).catch(deleteUserDataError => console.log(deleteUserDataError));
        })
    }

    const addUserButton = document.querySelector("button[data-add-user-button]");
    addUserButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (addForm) {
            const inputs = document.querySelectorAll("input");
            inputs.forEach(input => input.value = "")
            checkRoles().catch(addUserRolesError => console.error(addUserRolesError));
        }
    })

    if (addForm) {
        addForm.addEventListener("submit", (event) => {
            event.preventDefault();
            addUserData(addForm).catch(addUserDataError => console.log(addUserDataError));
        });
    }

    async function checkRoles() {
        const roles = await availableRoles();

        const modalRole = addForm.querySelector("select[name='role']");
        modalRole.innerHTML = "";

        for (let role of roles) {
            const option = document.createElement("option");
            option.classList.add("text-body")
            option.innerText = role.roleName;
            modalRole.append(option);
        }
    }
}

async function editUserData(formElement) {
    try {
        const roles = await availableRoles();

        const user = {
            id: formElement.querySelector("input[name='id']").value,
            firstName: formElement.querySelector("input[name='firstName']").value,
            surname: formElement.querySelector("input[name='lastName']").value,
            age: formElement.querySelector("input[name='age']").value,
            email: formElement.querySelector("input[name='email']").value,
            password: formElement.querySelector("input[type='password']").value,
            roles: checkedRoles(roles)
        }

        const url = `/api/users`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            console.log("User added successfully");
            await fetchAndRenderUsers();
            const modal = document.querySelector("#editModal"),
                closeButton = modal.querySelector("button[data-bs-dismiss='modal']");
            closeButton.click();
        }
    } catch (error) {

    }

    function checkedRoles(allRoles) {
        const checkedOptions = formElement.querySelectorAll("option:checked");
        const newRoles = [];

        for (let checkedOption of checkedOptions) {
            const roleObject = allRoles.find(role => role.roleName === checkedOption.textContent);

            if (roleObject) {
                newRoles.push(roleObject);
            }
        }
        return newRoles;
    }
}

async function deleteUserData(formElement) {
    try {
        const id = formElement.querySelector("input[name='id']").value;

        const url = `/api/users/${id}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log("User successfully deleted");
            await fetchAndRenderUsers();
            const modal = document.querySelector("#deleteModal"),
                closeButton = modal.querySelector("button[data-bs-dismiss='modal']");
            closeButton.click();
        }
    } catch (error) {
        console.error(error);
    }
}

async function addUserData(formElement) {
    const roles = await availableRoles();

    const user = {
        firstName: formElement.querySelector("input[name='firstName']").value,
        surname: formElement.querySelector("input[name='lastName']").value,
        age: formElement.querySelector("input[name='age']").value,
        email: formElement.querySelector("input[name='email']").value,
        password: formElement.querySelector("input[type='password']").value,
        roles: checkedRoles(roles)
    }

    try {
        const url = "/api/users";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            console.log("User was successfully created");
            const userTableButton = document.querySelector("button[data-user-table]");
            userTableButton.addEventListener("click", (event) => {
                event.preventDefault();
            })
            userTableButton.click();
            await fetchAndRenderUsers();
        }
    } catch (error) {
        console.error(error)
    }

    function checkedRoles(allRoles) {
        const checkedOptions = formElement.querySelectorAll("option:checked");
        const newRoles = [];

        for (let checkedOption of checkedOptions) {
            const roleObject = allRoles.find(role => role.roleName === checkedOption.textContent);

            if (roleObject) {
                newRoles.push(roleObject);
            }
        }
        return newRoles;
    }
}

