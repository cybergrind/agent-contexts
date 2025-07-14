// ==UserScript==
// @name         Fill MCP localhost
// @namespace    http://tampermonkey.net/
// @version      2025-04-15
// @description  try to take over the world!
// @author       You
// @match        http://localhost:6274/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const fillButton = document.createElement('button');
    fillButton.textContent = 'Fill Form';
    fillButton.style.position = 'fixed';
    fillButton.style.top = '10px';
    fillButton.style.right = '10px';
    fillButton.style.zIndex = '9999'; // Ensure it's on top

    // Function to simulate typing, attempting to trigger React state updates for input/textarea
    function textType(element, text) {
        element.focus(); // Ensure the element has focus

        let prototype;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'textarea') {
            prototype = window.HTMLTextAreaElement.prototype;
        } else if (tagName === 'input') {
            prototype = window.HTMLInputElement.prototype;
        } else {
            console.error("Unsupported element type:", tagName, "for element:", element);
            // Basic fallback for other types if needed
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            element.blur();
            return;
        }

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

        if (!nativeInputValueSetter) {
            console.error("Could not get native value setter for element:", element, ". Input might not update correctly.");
            // Fallback if setter fails
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            element.blur();
            return;
        }

        // Clear the value using the native setter first
        nativeInputValueSetter.call(element, '');
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        let currentValue = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            currentValue += char;

            element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true, cancelable: true }));
            element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true, cancelable: true }));

            nativeInputValueSetter.call(element, currentValue);

            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

            element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true, cancelable: true }));
        }
        element.blur(); // Remove focus after typing
    }


    function textType2(element, text) {
        element.focus(); // Ensure the element has focus

        // Get the native value setter - this is crucial for React controlled components
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, // Use HTMLInputElement for <input>
            "value"
        )?.set;

        if (!nativeInputValueSetter) {
            console.error("Could not get native value setter. Input might not update correctly.");
            // Fallback to basic value setting if setter isn't found
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); // Also try change event
            element.blur();
            return;
        }

        // Clear the value using the native setter first
        nativeInputValueSetter.call(element, '');
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
         element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));


        let currentValue = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            currentValue += char;

            // Dispatch keyboard events (might still be needed for some logic)
            element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true, cancelable: true }));
            element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true, cancelable: true }));

            // Use the native setter to update the value
            nativeInputValueSetter.call(element, currentValue);

            // Dispatch input and change events - React often listens for these
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); // Dispatch change event too

            element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true, cancelable: true }));
        }
        element.blur(); // Remove focus after typing
    }


    const fillForm = () => {
        const filename = document.querySelector('[name="filename"]');
        const length = document.querySelector('[name="length"]');
        const address = document.querySelector('[name="address"]');
        const addressOrName = document.querySelector('[name="address_or_name"]');
        const profileUuid = document.querySelector('[name="profile_uuid"]');
        const url = document.querySelector('[name="url"]')

        if (filename) textType(filename, 'GameAssembly.dll.bndb')
        if (length) textType(length, '128')
        if (address) textType(address, '0x00006ffff921d61e')
        if (addressOrName) textType(addressOrName, '0x00006ffff921d61e')
        if (profileUuid) textType(profileUuid, '0822bdeb3f874a52a8d93ac657adda8b')
        if (url) textType(url, 'https://perplexity.ai')

    }
    // Add click event listener
    fillButton.addEventListener('click', fillForm);




    // Add the button to the page body when the window loads
    window.addEventListener('load', () => {
        document.body.appendChild(fillButton);

         // Add keydown event listener to the document
        document.addEventListener('keydown', (event) => {
        // Check for Alt+M (or Alt+m)
        if (event.altKey && event.key.toLowerCase() === 'm') {
            event.preventDefault(); // Prevent default browser action for Alt+M if any
            fillForm();
        }
        });
    });
})();
