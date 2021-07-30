const navMenubtn = document.querySelector('.navbar__menu')
const navLink = document.querySelector('.navbar__links')
const linkContainer = document.querySelector('.navbar__links_container')
const linkBtn = document.querySelectorAll('.link');


navMenubtn.addEventListener('click', () => {
    linkContainer.classList.toggle('show')
})

// * close navbar
linkBtn.forEach(link => {
    link.addEventListener('click', () => {
        linkContainer.classList.remove('show')
    })
})