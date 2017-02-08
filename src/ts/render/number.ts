
document.addEventListener('DOMContentLoaded', (event) => {
    
    // Must use for in because targeting es5
    let inputFields = document.getElementsByTagName('input');
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].getAttribute('type').toLowerCase() === 'number') {
            // Is number, prevent up/down arrows
            inputFields[i].addEventListener('keydown', (event) => {
                if (event.which == 38 || event.which == 40) {
                    event.preventDefault();
                }
            });
        }
    }

});