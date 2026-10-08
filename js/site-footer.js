function openSiteInformation(page) {
    const pageIds = { terms: 'site-information-terms', privacy: 'site-information-privacy', contact: 'site-information-contact' };
    const dialog = Object.hasOwn(pageIds, page) && document.getElementById(pageIds[page]);
    if (dialog && !dialog.open) dialog.showModal();
    return false;
}

document.querySelectorAll('.site-information-dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right
            || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
});
