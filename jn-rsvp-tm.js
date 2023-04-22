// ==UserScript==
// @name         Bold First Two Syllables
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bold the first two syllables (sort of) of every word in every HTML paragraph.
// @author       Jose Nunez (@kuantif)
// @downloadURL  https://github.com/janunezc/jn-rsvp-web-tampermonkey/blob/master/jn-rsvp-tm.js
// @match        https://*.costaricamakers.com/*
// @match        https://*.nunez-technologies.com/*
// @match        https://*.c9eb.space/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const boldFirstTwoSyllables = (word) => {
        let syllables = 0;
        let boldedWord = '';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            boldedWord += char;
            if ('aeiouyAEIOUY'.includes(char) && (i === 0 || !'aeiouyAEIOUY'.includes(word[i - 1]))) {
                syllables++;
            }

            if (syllables === 2) {
                break;
            }
        }

        return `<strong>${boldedWord}</strong>` + word.slice(boldedWord.length);
    };

    const processParagraphs = () => {
        const paragraphs = document.querySelectorAll('body p');
        paragraphs.forEach(paragraph => {
            const words = paragraph.textContent.split(' ');
            const boldedWords = words.map(boldFirstTwoSyllables);
            paragraph.innerHTML = boldedWords.join(' ');
        });
    };

    const restoreOriginalParagraphs = () => {
        const paragraphs = document.querySelectorAll('body p');
        paragraphs.forEach(paragraph => {
            paragraph.innerHTML = paragraph.originalInnerHTML;
        });
    };

    const addButton = () => {
        const firstParagraph = document.querySelector('body p');
        const button = document.createElement('button');
        button.textContent = 'Fast Reading';
        button.style.display = 'block';
        button.style.marginBottom = '1rem';

        let isBolded = false;

        button.addEventListener('click', () => {
            if (!isBolded) {
                processParagraphs();
                button.textContent = 'Back to Normal';
            } else {
                restoreOriginalParagraphs();
                button.textContent = 'Fast Reading';
            }

            isBolded = !isBolded;
        });

        firstParagraph.parentNode.insertBefore(button, firstParagraph);
    };

    const storeOriginalParagraphs = () => {
        const paragraphs = document.querySelectorAll('body p');
        paragraphs.forEach(paragraph => {
            paragraph.originalInnerHTML = paragraph.innerHTML;
        });
    };

    setTimeout(() => {
        storeOriginalParagraphs();
        addButton();
    }, 1000); // wait for 1 second before executing the storeOriginalParagraphs and addButton functions
})();
