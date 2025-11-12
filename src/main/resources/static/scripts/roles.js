async function availableRoles() {
    try {
        const response = await fetch("/api/roles");
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export {availableRoles};