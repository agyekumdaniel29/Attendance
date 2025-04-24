function validateInput(input) {
    return input && input.trim() !== '';
}

function clearInput(inputElement) {
    inputElement.value = '';
}

function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}

function appendToParent(parent, child) {
    parent.appendChild(child);
}

export { validateInput, clearInput, createElement, appendToParent };