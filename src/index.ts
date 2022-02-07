import {ipcRenderer} from 'electron';

const actionBtn: HTMLElement = document.getElementById("action-btn");
let boutonValide: HTMLLinkElement = <HTMLLinkElement>document.getElementById("action-btn");
const dropzone: EventTarget = document.getElementById("dropzone");
const dropzoneHTML: HTMLElement = document.getElementById("listResult");

let listResult: string[] = [];
dropzone.addEventListener('dragover', (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
});

dropzone.addEventListener('drop', (event: InputEvent) => {
    event.stopPropagation();
    event.preventDefault();

    // console.log(event);
    const files: FileList = event.dataTransfer.files;
    boutonValide.disabled = false;


    for (let i = 0; i < files.length; i++) {
        if (listResult.includes(files.item(i).path)) {
            const div = messageNote(files, i, false, "Est déja listé");
            dropzoneHTML.prepend(div);
            div.style.animation = "fade 2s";
            div.style.animationDelay = "3s";
            setTimeout(() => {
                dropzoneHTML.removeChild(div);
            }, 5000);


        }
        if (files.item(i).type !== "application/json") {
            const div = messageNote(files, i, false, "n'est pas un JSON");
            dropzoneHTML.prepend(div);
            div.style.animation = "fade 2s";
            div.style.animationDelay = "3s";
            setTimeout(() => {
                dropzoneHTML.removeChild(div);
            }, 5000);

        }

        if (!listResult.includes(files.item(i).path) && files.item(i).type === "application/json") {

            // port2.postMessage({data: listResult});
            ipcRenderer.invoke('checkFormatsInterface', files.item(i).path).then((information) => {
                console.log("checkFormatsInterface", information);
                if (information !== '') {
                    let div = document.createElement("div");
                    div.classList.add("notification");
                    div.classList.add("is-success");
                    div.id = files.item(i).path;
                    const button = document.createElement("button");
                    button.classList.add("delete");
                    let strong = document.createElement("strong");
                    strong.textContent = "Fichier: " + files.item(i).name;
                    div.appendChild(button);
                    div.appendChild(strong);
                    div.appendChild(document.createElement("br"));
                    const small = document.createElement('small');
                    const textElement = document.createTextNode("Element: " + information);
                    const textSmall = document.createTextNode("Type: " + files.item(i).type);
                    div.appendChild(textElement);
                    div.appendChild(document.createElement("br"));
                    small.appendChild(textSmall);
                    div.appendChild(small);
                    dropzoneHTML.prepend(div);

                    listResult.push(files.item(i).path)

                    button.addEventListener("click", () => {
                        dropzoneHTML.removeChild(div);
                        // listResult.remove(files.item(i).path);
                        listResult = listResult.filter(obj => obj !== files.item(i).path);
                        button.removeEventListener('click', null);
                    });
                } else {
                    const div = messageNote(files, i, false, "n'est pas un JSON compatible");
                    dropzoneHTML.prepend(div);
                    div.style.animation = "fade 2s";
                    div.style.animationDelay = "3s";
                    setTimeout(() => {
                        dropzoneHTML.removeChild(div);
                    }, 5000);

                }
            })


        }
    }
    actionBtn.addEventListener("mousedown", () => {
        console.log("-->", listResult);
        // port2.postMessage({data: listResult});

    });


});

function messageNote(files: FileList, i: number, ok: boolean, comment?: string): HTMLDivElement {
    let div = document.createElement("div");
    div.classList.add("notification");
    if (ok) {
        div.classList.add("is-success");
    } else {
        div.classList.add("is-danger");
    }
    div.id = files.item(i).path;

    let strong = document.createElement("strong");
    if (comment) {
        strong.textContent = files.item(i).name + " " + comment;
    } else {
        strong.textContent = "Fichier: " + files.item(i).name;
    }
    div.appendChild(strong);
    div.appendChild(document.createElement("br"));
    const text = document.createTextNode("Type: " + files.item(i).type);
    div.appendChild(text);

    return div;
}
