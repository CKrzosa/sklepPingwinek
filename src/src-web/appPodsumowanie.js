
//Dodanie zdjecia loga

let logo = document.querySelector("#logo");
let img = document.createElement("img");
img.src = "/src-web/zdjecia/LogoMakr-243h9z.png";
img.classList.add('logo')
logo.appendChild(img);





fetch("/danePodsumowanie", {
    method: "GET"

}).then((data) => data.json()).then((data) => {
    let suma = 0
    let ulNR = data[0]["UlNr"]
    let cena = data[0]["cena"]
    let ilosc = data[0]["ilosc"]
    let imie = data[0]["imie"]
    let kodPocztowy = data[0]["kodPocztowy"]
    let miejscowosc = data[0]["miejscowosc"]
    let nazwa = data[0]["nazwa"]

    for (i = 0; i < data.length; i++) {


        suma += data[i]["cena"] * data[i]["ilosc"]




    }


    //podziękowanie 

    const para = document.createElement("p");
    const node = document.createTextNode(`Dziekujemy ${imie} za dokonanie zakupu`);
    para.appendChild(node);

    const element = document.getElementById("podziekowania");
    element.appendChild(para);


    //lista kupionych produktów
    for (i = 0; i < data.length; i++) {

        const list = document.createElement("li");
        if (data[i]["nazwa"] === "Mleko" || data[i]["nazwa"] === "Cebula") { produktyLista = document.createTextNode(`${data[i]["nazwa"]} w ilość: ${data[i]["ilosc"]} sztuk`) } else { produktyLista = document.createTextNode(`${data[i]["nazwa"]} w ilość: ${data[i]["ilosc"]} kg`) }
        list.appendChild(produktyLista);
        const elelista = document.getElementById("kupioneProdukty");
        elelista.appendChild(list);




    }

    //Adres
    const addres = document.createElement("p");
    const podsumowanie = document.createTextNode(`Po dokonaniu przelewu ${suma.toFixed(2)} zł na konto 90 1015 1982 1000 0000 3532 towar zostanie przesłany na adres ${kodPocztowy} ${miejscowosc} ${ulNR}`);
    addres.appendChild(podsumowanie);

    const dodajAddres = document.getElementById("addres");
    dodajAddres.appendChild(addres);

})