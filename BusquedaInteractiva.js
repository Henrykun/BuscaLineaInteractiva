// ==UserScript==
// @name         Búsqueda Interactiva con Resaltado y Desplazamiento
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Busca palabras en la página, resalta las encontradas, se desplaza hacia ellas y permite navegar interactivamente
// @author       Tu Nombre
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Crear un área de texto y un botón para pegar la lista
    let textarea = document.createElement('textarea');
    textarea.placeholder = 'Pega la lista de palabras aquí';
    textarea.style.position = 'fixed';
    textarea.style.top = '10px';
    textarea.style.right = '10px';
    textarea.style.width = '200px';
    textarea.style.height = '100px';
    textarea.style.zIndex = '10000';

    let button = document.createElement('button');
    button.innerText = 'Iniciar Búsqueda';
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.right = '10px';
    button.style.zIndex = '10000';

    let nextButton = document.createElement('button');
    nextButton.innerText = 'Buscar Siguiente';
    nextButton.style.position = 'fixed';
    nextButton.style.top = '160px';
    nextButton.style.right = '10px';
    nextButton.style.zIndex = '10000';
    nextButton.style.display = 'none'; // Ocultar botón hasta que se inicie la búsqueda

    document.body.appendChild(textarea);
    document.body.appendChild(button);
    document.body.appendChild(nextButton);

    let wordsToSearch = [];
    let currentIndex = 0;

    button.addEventListener('click', () => {
        wordsToSearch = textarea.value.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        currentIndex = 0;
        if (wordsToSearch.length > 0) {
            searchWord(wordsToSearch[currentIndex]);
            nextButton.style.display = 'block';
        } else {
            alert('Por favor, pega una lista de palabras.');
        }
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < wordsToSearch.length) {
            searchWord(wordsToSearch[currentIndex]);
        } else {
            alert('Búsqueda completada.');
            nextButton.style.display = 'none';
        }
    });

    function searchWord(word) {
        // Remover resaltado previo
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });

        let found = false;

        // Resaltar palabra encontrada
        function highlight(node, word) {
            const regex = new RegExp(`(${word})`, 'gi');
            if (node.nodeType === 3) { // Es un nodo de texto
                if (regex.test(node.nodeValue)) {
                    found = true;
                    const span = document.createElement('span');
                    span.innerHTML = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    highlight(node.childNodes[i], word);
                }
            }
        }

        highlight(document.body, word);

        // Estilo para resaltado
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.highlight { background-color: yellow; color: black; }';
        document.head.appendChild(style);

        if (found) {
            const highlightedElement = document.querySelector('.highlight');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            alert(`${word}: Encontrado`);
        } else {
            alert(`${word}: No encontrado`);
        }
    }
})();
