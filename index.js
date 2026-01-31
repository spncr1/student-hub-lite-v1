// just gonna keep this simple to help at least get an idea for the dashboard

/* BUTTONS (do something with these - will implement later) */
const todayBtn = document.getElementById("today-btn");
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");

function today (){
    
}

function previous (){

}

function next (){
    
}

// the code i used to create my hamburger-style navbar for an older version of my personal website. will need some tweaking and i don't understand all of it just yet, but this can give me an idea on how i could do it
const menuToggle = document.querySelector('.menu-toggle');
const sideNav = document.querySelector('.side-nav');

menuToggle.addEventListener('click', () => {
    sideNav.classList.toggle('open');
});
    if (menuToggle && sideNav) {
    menuToggle.addEventListener('click', () => {
        sideNav.classList.toggle('open');
    });

    sideNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            sideNav.classList.remove('open');
        }
    });
        sideNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                sideNav.classList.remove('open');
            }
        });
    }