async function fetchAndRenderCurrentUser() {
    try {
        const response = await fetch("/api/current-user");

        const user = await response.json();

        renderCurrentUser(user);

    } catch (err) {
        console.log(err);
    }
}

export let roles;

function renderCurrentUser(user) {
    /*Header*/
    const headerEmail = document.getElementById("headerEmail");
    headerEmail.textContent = user.email;

    roles = [];
    if (user.roles.length > 1) {
        user.roles.forEach(role => {
            roles.push(role.roleName);
        });
    } else {
        roles = user.roles;
    }

    let headerRoles = document.getElementById("headerRole");
    const headerRolesBlock = document.getElementById("headerRoles");
    if (roles.length > 1) {
        const newSpanElement = document.createElement("span");
        newSpanElement.id = "headerRole";
        headerRolesBlock.append(newSpanElement);
        headerRoles = document.querySelectorAll("#headerRole");
        headerRoles[0].textContent = roles[0];
        headerRoles[1].textContent = roles[1];
    } else {
        headerRoles.innerText = roles[0].roleName;
    }
    /*Header*/

    /* As User Info */

    const userCurrentInfoBlock = document.getElementById("userInfoActive");
    if (userCurrentInfoBlock) {
        userData(roles);
    }

    const userInfoButton = document.querySelector(".nav-link[href='#user']");
    if (userInfoButton) {
        userInfoButton.addEventListener("click", (event) => {
            event.preventDefault();
            userData(roles);
        });
    }

    /* As User Info */

    function userData(roles) {
        const userInfoId = document.getElementById("userInfoId"),
            userInfoFName = document.getElementById("userInfoFirstName"),
            userInfoLName = document.getElementById("userInfoLastName"),
            userInfoAge = document.getElementById("userInfoAge"),
            userInfoEmail = document.getElementById("userInfoEmail"),
            userInfoRoles = document.getElementById("userInfoRoles");

        userInfoId.textContent = user.id;
        userInfoFName.textContent = user.firstName;
        userInfoLName.textContent = user.surname;
        userInfoAge.textContent = user.age;
        userInfoEmail.textContent = user.email;

        // console.log(roles);
        if (userInfoRoles.children.length === 0) {
            for (let i = 0; i < roles.length; i++) {
                const role = document.createElement("span");
                role.classList.add("me-2");
                if (roles.length === 1) {
                    role.innerText = roles[i].roleName;
                } else {
                    role.innerText = roles[i];
                }

                userInfoRoles.append(role);
            }
        }
    }
}

export {fetchAndRenderCurrentUser};