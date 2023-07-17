const menuButtons = document.querySelectorAll('.inst-dropdown');

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        let instruction = button.nextElementSibling;
        if(instruction.style.maxHeight)
        {
            instruction.style.maxHeight = null;
        } 
        else
        {
            instruction.style.maxHeight = instruction.scrollHeight + "px";
        }
    })
});