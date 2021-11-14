
//Dodanie zdjecia loga

let logo = document.querySelector("#logo");
let img = document.createElement("img");
img.src = "/src-web/zdjecia/LogoMakr-243h9z.png";
img.classList.add('logo')
logo.appendChild(img);

// Dodanie zdjecia koszyka
if (document.cookie !== "") {
    let kosz = document.querySelector("#koszyk");
    let img2 = document.createElement("img");
    img2.src = "/src-web/zdjecia/kosz.png";
    img2.classList.add('kosz')
    kosz.appendChild(img2);
    document.getElementById("koszCount").style.display = "flex";

} else {
    document.getElementById("koszCount").style.display = "none";

}

//Dodawanie podsumowaniea

fetch("/danePodsumowanie", {
    method: "GET"

}).then((data) => data.json()).then((data) => {
    if (data[0]["zaplista"] !== 0) {
        let podsumowanie = document.querySelector("#podsumowanie");
        let img3 = document.createElement("img");
        img3.src = "/src-web/zdjecia/LogoMakr-464rK5.png";
        img3.classList.add('podsumowanie')
        podsumowanie.appendChild(img3);
    }
})









// Przyciski wyloguj 
if (document.cookie !== "") {

    document.getElementById("butt1").style.display = "none";
    document.getElementById("butt2").style.display = "none";
    document.getElementById("butt3").style.display = "block";
} else {

    document.getElementById("butt3").style.display = "none";
    document.getElementById("butt1").style.display = "block";
    document.getElementById("butt2").style.display = "block";
}


// Przejscie do logowania 

let form = document.getElementsByClassName("form")
let foto = document.getElementsByClassName("foto")

document.getElementById("butt1").addEventListener("click", function logowanieON() {
    document.getElementById("logowanie").style.display = "flex";

    for (let i = 0; i < form.length; i++) {
        form[i].style.display = "none";
    }

    for (let i = 0; i < foto.length; i++) {
        foto[i].style.display = "none";
    }
    document.getElementById("footer").style.display = "none";
    document.getElementById("header").style.display = "none";

})

document.getElementById("back").addEventListener("click", function logowanieOFF() {
    document.getElementById("logowanie").style.display = "none";

    for (let i = 0; i < form.length; i++) {
        form[i].style.display = "flex";
    }

    for (let i = 0; i < foto.length; i++) {
        foto[i].style.display = "flex";
    }
    document.getElementById("footer").style.display = "flex";
    document.getElementById("header").style.display = "flex";

})



// Przejscie do rejestracji

document.getElementById("butt2").addEventListener("click", function rejestracjaON() {
    document.getElementById("rejestracja").style.display = "flex";

    for (let i = 0; i < form.length; i++) {
        form[i].style.display = "none";
    }

    for (let i = 0; i < foto.length; i++) {
        foto[i].style.display = "none";
    }
    document.getElementById("footer").style.display = "none";
    document.getElementById("header").style.display = "none";

})

document.getElementById("backRej").addEventListener("click", function rejestracjaOFF() {
    document.getElementById("rejestracja").style.display = "none";

    for (let i = 0; i < form.length; i++) {
        form[i].style.display = "flex";
    }

    for (let i = 0; i < foto.length; i++) {
        foto[i].style.display = "flex";
    }
    document.getElementById("footer").style.display = "flex";
    document.getElementById("header").style.display = "flex";

})

// usuwanie cookie przy wylogowaniu

document.getElementById("butt3").addEventListener("click", function wylogowanie() {


    document.cookie = `${document.cookie}; expires=Thu, 01 Jan 1980 00:00:01 GMT;`;

    window.location = ""
})






//Funkcja dodajaca zdjecia
function addstaff(imgID, imgSrc, formID, labelID, lableText,) {

    let conID = document.querySelector("#contenerID");


    let img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add('foto')
    img.setAttribute("id", imgID)
    conID.appendChild(img);

    let form = document.createElement("form");
    form.classList.add('form')
    form.setAttribute("id", formID)
    conID.appendChild(form);

    let label = document.createElement("label");
    label.classList.add('owoc')
    label.setAttribute("id", labelID)
    form.appendChild(label);
    label.innerHTML = lableText

    if (document.cookie !== "") {
        let button = document.createElement("button");
        button.classList.add('koszbutt')
        button.formAction = "/ukrtyKoszyk"
        button.formMethod = "POST"
        button.name = imgSrc
        form.appendChild(button);
        button.innerHTML = "Dodaj do Koszyka"


    }



}



//fetch z zapytanie o shop oraz przejsciem i wygereowaniem elementow na stronie 

fetch("/DaneZShop", {
    method: 'GET',
}).then((data) => data.json()).then((owocki) => {
    for (let objekt in owocki) {

        let ilosc = "kg"

        if (owocki[objekt]["nazwa"] === "Kaiserka" || owocki[objekt]["nazwa"] === "Maslo") {
            ilosc = "sztukach"
        } else if (owocki[objekt]["nazwa"] === "Mleko" || owocki[objekt]["nazwa"] === "Olej") {
            ilosc = "1L"
        }
        addstaff(`${"fot" + owocki[objekt]["id"]}`, `/src-web/zdjecia/${owocki[objekt]["nazwa"]}.jpg`, `${"form" + owocki[objekt]["id"]}`, `${"owoc" + owocki[objekt]["id"]}`, `Ilość w ${ilosc}: ${owocki[objekt]["ilosc"]} | Cena: ${owocki[objekt]["cena"]}zł`)


    }



})



//Fetch na zliczanie ilosci rzeczy w koszyku





fetch("/count", {
    method: "GET"
}).then((data) => data.json()).then((data) => {



    const para = document.createElement("p");
    const node = document.createTextNode(`${data[0]["COUNT(id)"]}`);
    para.appendChild(node);

    let licznik = document.getElementById("koszCount")
    licznik.appendChild(para);


}



)