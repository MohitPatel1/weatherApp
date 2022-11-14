document.addEventListener("DOMContentLoaded", () => {

    const switchTheme = () => {
        if(themePreferenceDark.matches){
            document.body.classList.toggle("light-theme");
        } else {
            document.body.classList.toggle("dark-theme")
        }
    }

    const themeSwitcher = document.getElementById("theme-change-button");
    const themePreferenceDark = window.matchMedia("prefers-color-scheme: dark")
    themeSwitcher.textContent = themePreferenceDark.matches ? "Light" : "Dark" ;
})