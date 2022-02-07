// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

customBtn.addEventListener("click", function() {
    realFileBtn.click();
});

realFileBtn.addEventListener("change", function() {
    const file = this.files[0];
    if (realFileBtn.value) {
        customTxt.innerHTML = realFileBtn.value.match(
            /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];

        console.log(realFileBtn);
        console.log(file);
        const reader = new FileReader();
        console.log(file.path);
        reader.addEventListener('load', () => {
            // preview.setAttribute('src', this.result);
            console.log(reader.result);
        })
        reader.readAsDataURL(file);


    } else {
        customTxt.innerHTML = "No file chosen, yet.";
    }
});
