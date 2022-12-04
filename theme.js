document.addEventListener("DOMContentLoaded", () => {

    const switchTheme = () => {
            document.body.classList.toggle("light-theme");
            const themeButton = document.querySelector(".theme-change-button")
            console.log(themeButton.src);
            themeButton.src = (document.body.classList.contains("light-theme")) ? "images/toggle_light.png" : "images/toggle_dark.png" ;
    }

    const themeSwitcher = document.querySelector(".theme-change-button");
    themeSwitcher.addEventListener("click" , switchTheme);
    // const themePreferenceDark = window.matchMedia("prefers-color-scheme: dark"); // try light instead
    // console.log(themePreferenceDark.matches);
    // if(themePreferenceDark){
    //     switchTheme();
    // }
    // else{
    // }

})