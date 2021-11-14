


//Wysłanie fetch nazwy owoców oraz zakupione ilosci

document.getElementById("kup").addEventListener("click", function () {
    let listaZOwocami = [];
    for (i = 0; i < document.getElementsByClassName("inputCena").length; i++) {

        nazwaOwoca =
            document.getElementsByClassName("inputCena")[i].id
        ilosc =
            document.getElementsByClassName("inputCena")[i].value

        listaZOwocami.push(nazwaOwoca)
        listaZOwocami.push(ilosc)


    }



    fetch('/koszyk', {
        method: "POST",
        redirect: 'follow',
        body: JSON.stringify(listaZOwocami),
    }).then((data) => location.href = `${data.url}`)




})



let logo = document.querySelector("#logo");
let img = document.createElement("img");
img.src = "/src-web/zdjecia/LogoMakr-243h9z.png";
img.classList.add('logo')
logo.appendChild(img);

//Fukcja do usuwania elemetów z koszyka.
function krzyzyk(e) {


    let killTarget = e.target.id
    killTarget = killTarget.substring(0, killTarget.length - 1)




    const killCommand = fetch("/usun", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'

        },
        credentials: "same-origin",

        body: `${killTarget}`,



    }).then((res) => console.log(res)).then(() => location.reload())



}




listaOwocy = ["Kaiserka", 'Pomidory', 'Jajka', 'Maslo', 'Mleko', 'Cebula', 'Olej', 'Jablka']

for (i = 0; i < listaOwocy.length; i++) {
    try {
        document.getElementById(`${listaOwocy[i]}x`).addEventListener("click", krzyzyk)
        document.getElementById(`${listaOwocy[i]}y`).addEventListener("click", krzyzyk)
    }
    catch (err) { }

}

