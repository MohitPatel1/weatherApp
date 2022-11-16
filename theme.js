document.addEventListener("DOMContentLoaded", () => {

    const switchTheme = () => {
        console.log(1);
        if(themePreferenceDark.matches){
            document.body.classList.toggle("light-theme");
        } else {
            document.body.classList.toggle("dark-theme")
        }
    }

    const themeSwitcher = document.getElementById("theme-change-button");
    const themePreferenceDark = window.matchMedia("prefers-color-scheme: dark");
    themeSwitcher.addEventListener("click" , switchTheme)
    themeSwitcher.textContent = themePreferenceDark.matches ? "Light" : "Dark" ;

})