document.addEventListener("DOMContentLoaded", () => {

    const switchTheme = () => {
            document.body.classList.toggle("light-theme");
            themeSwitcher.textContent = (document.body.classList.value === "light-theme") ? "Dark" : "Light" ;
    }

    const themeSwitcher = document.getElementById("theme-change-button");
    themeSwitcher.addEventListener("click" , switchTheme);
    // const themePreferenceDark = window.matchMedia("prefers-color-scheme: dark"); // try light instead
    // console.log(themePreferenceDark.matches);
    // if(themePreferenceDark){
    //     switchTheme();
    // }
    // else{
    // }
        
    themeSwitcher.textContent = (document.body.classList.value === "light-theme") ? "Dark" : "Light" ;
})