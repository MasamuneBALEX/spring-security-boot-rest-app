import {fetchAndRenderCurrentUser} from './user-core.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderCurrentUser().catch(currentUserError => console.log(currentUserError))
});