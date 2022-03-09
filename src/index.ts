import {ipcRenderer, shell} from 'electron';

const dayjs = require('dayjs');
const tbodyspan: HTMLElement = document.getElementById("tbodyspan");


// les appels ICP

ipcRenderer.invoke('config', null).then((config) => {
    const time: HTMLElement = document.getElementById("time");
    time.textContent = dayjs(config.lastExecution).format('DD/MM/YYYY HH[h]mm');
});

ipcRenderer.invoke('pathAppData', null).then((files: Record<string, number>) => {
    informationAppdata(files);
});

ipcRenderer.on('updateAppData', (event: Electron.IpcRendererEvent, savedPref) => {
    clearinformationAppdata();
    ipcRenderer.invoke('pathAppData', null).then((files: Record<string, number>) => {
        informationAppdata(files);
    });
});

function clearinformationAppdata() {
    const tbody: HTMLElement = document.getElementById("tbody");
    tbody.remove();
}

function informationAppdata(files: Record<string, number>) {
    const tbody: HTMLElement = document.createElement('tbody');
    tbody.id = "tbody";
    Object.keys(files).forEach((key: string) => {
        const tr = document.createElement('tr');
        const tdKey = document.createElement('td');
        tdKey.textContent = key;
        const tdLenght = document.createElement('td');
        tdLenght.textContent = `${files[key]}`;
        tr.appendChild(tdKey);
        tr.appendChild(tdLenght);
        tbody.appendChild(tr);
    });
    tbodyspan.prepend(tbody);
}

ipcRenderer.invoke('majCloud', false).then((config) => {
    console.log("config", config);
    if (config) {
        (document.getElementById("maj-btn") as HTMLLinkElement).disabled = false;
    }
});


// Elements
const actionBtn: HTMLElement = document.getElementById("action-btn");
let boutonValide: HTMLLinkElement = <HTMLLinkElement>document.getElementById("action-btn");
const dropzone: EventTarget = document.getElementById("dropzone");
const dropzoneHTML: HTMLElement = document.getElementById("listResult");

document.getElementById("close-btn").addEventListener("click", function (e) {
    window.close();
});

document.getElementById("min-btn").addEventListener("click", function (e) {
    console.log(e);
});

document.getElementById("folder-btn").addEventListener("click", function (e) {
    ipcRenderer.invoke('appdata', null).then((urlAppdata) => {
        shell.openPath(urlAppdata + '/data/');
    });
});

document.getElementById("maj-btn").addEventListener("click", function (e) {
    console.log("BOUTON");
    ipcRenderer.invoke('majCloud', true).then((config) => {
        console.log("config", config);
        if (config) {
            (document.getElementById("maj-btn") as HTMLLinkElement).textContent
                = (document.getElementById("maj-btn") as HTMLLinkElement).textContent + '✅';
            (document.getElementById("maj-btn") as HTMLLinkElement).disabled = true;
        }
    });
});

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

    // boutons
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

            ipcRenderer.invoke('checkFormatsInterface', files.item(i).path)
                .then((information) => {
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

                        div.appendChild(document.createElement("br"));

                        let div2 = document.createElement("div");
                        div2.classList.add("columns");
                        div2.classList.add("is-mobile");
                        let buttonAction = document.createElement("button");
                        buttonAction.classList.add("button");
                        buttonAction.classList.add("column");

                        buttonAction.classList.add("is-offset-9");
                        buttonAction.textContent = "ACTION";

                        div2.appendChild(buttonAction);
                        div.appendChild(div2);
                        dropzoneHTML.prepend(div);

                        listResult.push(files.item(i).path);

                        buttonAction.addEventListener("click", function (e) {
                            console.log(files.item(i).path);
                            ipcRenderer.invoke('actionBtn', files.item(i).path).then((action) => {
                                console.log("actionBtn", action);
                                if (action) {
                                    dropzoneHTML.removeChild(div);
                                    // listResult.remove(files.item(i).path);
                                    listResult = listResult.filter(obj => obj !== files.item(i).path);
                                    button.removeEventListener('click', null);
                                }
                            });
                        });

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
                });


        }
    }

    // boutons
    actionBtn.addEventListener("mousedown", () => {
        console.log("-->", listResult);
    });

});

function messageNote(files: FileList, i: number, ok: boolean, comment?: string): HTMLDivElement {
    let div = document.createElement("div");
    div.classList.add("notification");
    div.classList.add("is-danger");
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

