const http = require("http");
const fs = require('fs');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const host = 'localhost';
const port = 8000;
const saltRounds = 10;

function errorCode(res, code) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(code);
    res.end(JSON.stringify({ "Error!": `${code}` }));
}
// Komunikaty przy nie powodzeniu rejestracji lub logowaniu
function komunikatOLogowaniu(zamiana, wartoscWCss, res) {

    fs.readFile(__dirname + '/src-web' + '/logowanie.html', 'utf8', (err, data) => {
        if (err) {


            console.error(err)
            return
        }

        data = data.replace(`${wartoscWCss}`, `${zamiana}`)

        res.end(data)
    })
}
//Przekierownaie na pod strone po nie udanym logowaniu

function komunkatRejestracja(res) {

    fs.readFile(__dirname + '/src-web' + '/rejestracja.html', 'utf8', (err, data) => {
        if (err) {


            console.error(err)
            return
        }

        res.end(data)
    })
}
//Strona błedu 404
function readFile(strona, res, req) {

    fs.readFile(__dirname + '/src-web' + strona, function (err, data) {
        if (err) {

            res.statusCode = 404;
            readFile("/404.html", res, req);
            return;
        }
        res.statusCode = 200;
        res.end(data);
    })

}
//Funkcja do zapytan MySQL 
function promiseQuery(zapytanie) {
    return new Promise(function (resolve, reject) {

        con.query(zapytanie, (err, rows) => {
            if (err) reject(err)
            resolve(rows)


        });
    })
}

// Server
const server = http.createServer(async (req, res) => {
    let LoggedOrNotLoggedThisIsAQuestion = false
    let UzytkownikID = null
    async function checkIfUserLoggedIn(req) {

        let login = req.headers.cookie.split(":")[0]

        let haslo = req.headers.cookie.split(":")[1]


        let check = await promiseQuery(`SELECT Login, Haslo, id FROM User WHERE '${login}' = Login`)

        if (check[0] !== undefined) {


            let promiscookies = new Promise(function (resolve, reject) {
                bcrypt.compare(haslo, check[0]["Haslo"], function (err, respond) {
                    if (err) reject(err)
                    resolve(respond)

                })

            })
            let zlapPrmoissa
            zlapPrmoissa = await promiscookies

            if (zlapPrmoissa === true) {

                LoggedOrNotLoggedThisIsAQuestion = true
                UzytkownikID = check[0]["id"]
            }
        }

    }
    if (req.headers.cookie !== undefined) { await checkIfUserLoggedIn(req) }

    switch (req.url) {

        // Strona startowa 
        case "/":
            if (req.method == "GET") {
                readFile("/home.html", res, req)

            } else { errorCode(res, 404) }
            break
        //Logowanie sie do strony 
        case "/logowanie":
            if (req.method == "POST") {

                if (LoggedOrNotLoggedThisIsAQuestion) {

                    console.log("wchodzisz")
                }
                else {
                    let data = '';
                    req.on('data', chunk => {
                        data += chunk;
                    })

                    req.on('end', () => {

                        let login = data.split("&")[0]
                        login = login.split("=")[1]

                        let haslo = data.split("&")[1]
                        haslo = haslo.split("=")[1]

                        con.query(`SELECT Login, Haslo FROM User WHERE '${login}' = Login `, (err, rows) => {
                            if (err) throw err;

                            if (rows[0] !== undefined) {
                                bcrypt.compare(haslo, rows[0]["Haslo"], function (err, respond) {
                                    if (respond == true) {

                                        res.setHeader("Set-Cookie", login + ":" + haslo)




                                        console.log("zalogowanyPrzezLogin")
                                        res.writeHead(302, { 'Location': "/" })
                                        res.end();


                                    } else { komunikatOLogowaniu("false", "true", res) }


                                });
                            }
                            else {
                                { komunikatOLogowaniu("false", "true", res) }


                            }

                        });

                    })
                }
            }
            break
        case "/usun":
            if (req.method == "DELETE") {


                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    promiseQuery(`DELETE FROM Koszyk WHERE nazwa = '${data}'`)


                    res.end(data)

                })

            }

            break

        case "/rejestracja":
            if (req.method == "POST") {


                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    let imie = data.split("&")[0]
                    imie = imie.split("=")[1]

                    let nazwisko = data.split("&")[1]
                    nazwisko = nazwisko.split("=")[1]

                    let email = data.split("&")[2]
                    email = email.split("=")[1]

                    let miejscowosc = data.split("&")[3]
                    miejscowosc = miejscowosc.split("=")[1]

                    let kodPocztowy = data.split("&")[4]
                    kodPocztowy = kodPocztowy.split("=")[1]

                    let UlNr = data.split("&")[5]
                    UlNr = UlNr.split("=")[1]

                    let Login = data.split("&")[6]
                    Login = Login.split("=")[1]

                    let haslo = data.split("&")[7]
                    haslo = haslo.split("=")[1]

                    let powtorzenie = data.split("&")[8]
                    powtorzenie = powtorzenie.split("=")[1]


                    if (powtorzenie === haslo && imie !== "" && nazwisko !== "" && email !== "" && miejscowosc !== "" && kodPocztowy !== "" && UlNr !== "" && Login !== "" && imie.length > 3 && nazwisko.length > 3 && email.length > 3 && miejscowosc.length > 3 && kodPocztowy.length >= 5 && UlNr.length >= 1 && Login.length >= 3 && haslo.length > 3 && powtorzenie.length > 3) {

                        bcrypt.genSalt(saltRounds, (err, salt) => {
                            bcrypt.hash(haslo, salt, (err, hash) => {

                                let rejestracja = `INSERT INTO User(Imie,Nazwisko,Email,Miejscowosc,kodPocztowy,UlNr,Login,Haslo ) 
                VALUES ('${imie}', '${nazwisko}', '${email}', '${miejscowosc}', '${kodPocztowy}', '${UlNr}', '${Login}', '${hash}' );`


                                con.query(rejestracja, function (err, rows) {
                                    if (err) komunkatRejestracja(res);


                                    readFile("/home.html", res, req)


                                });
                            });
                        });
                    } else {

                        komunkatRejestracja(res)

                    }
                })



            }
            break
        //Zapytanie aby wyswietlić zdjecia na stronie głownej 
        case "/DaneZShop":
            if (req.method == "GET") {

                let data = await promiseQuery(`SELECT * FROM Shop`)

                res.end(JSON.stringify(data))

            }
            break

        //Obsługa kup w koszyku
        case "/koszyk":
            if (req.method == "POST") {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', async () => {
                    let jsonData = JSON.parse(data)

                    for (i = 0; i < jsonData.length - 1; i += 2) {


                        dataOwoc = jsonData[i]

                        dataIlosc = jsonData[i + 1]



                        let promisIlosc = await promiseQuery(`SELECT ilosc FROM Shop WHERE nazwa = '${dataOwoc.trim()}'`)
                        let iloscShop = promisIlosc[0]["ilosc"]

                        let podsumowaniewartosc = 0
                        let wartosc = 0
                        let roznica = iloscShop - dataIlosc


                        if (dataIlosc > iloscShop) {
                            wartosc = 0
                            podsumowaniewartosc = iloscShop
                        }
                        else {
                            wartosc = roznica
                            podsumowaniewartosc = dataIlosc
                        }

                        if (dataIlosc !== "" && dataIlosc !== "0" && dataIlosc !== 0) {
                            let promisyzayptanko = await promiseQuery(
                                `UPDATE Shop
                                 SET ilosc = ${wartosc}
                                WHERE nazwa = '${dataOwoc.trim()}'
                                `

                            )



                            await promiseQuery(`INSERT INTO podsumowanie(nazwa,ilosc,UserID) 
                        VALUES('${dataOwoc.trim()}','${podsumowaniewartosc}','${UzytkownikID}' )
                    `)
                        }




                    }
                    await promiseQuery(`DELETE FROM Koszyk WHERE UserID ='${UzytkownikID}'`)
                    res.writeHead(302, { 'Location': "/podsumowanieStrona" })
                    res.end();


                })

            }
            else {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                if (UzytkownikID != null) { koszyk(res, UzytkownikID); }
            }



            break
        //Zapytanie do licznika obok koszkya 
        case "/count":
            if (req.method == "GET") {
                let countZapytanie = await promiseQuery(`SELECT COUNT(id) FROM Koszyk WHERE UserID ='${UzytkownikID}'`)

                res.end(JSON.stringify(countZapytanie))

            }


        //Tworzenie produktów w koszyku 
        case "/ukrtyKoszyk":
            if (req.method == "POST") {

                let body = [];
                req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', async () => {
                    body = Buffer.concat(body).toString();

                    let owoc = body.split(".")[0]
                    owoc = owoc.split("F")[3]
                    let owocMySQL = await promiseQuery(`SELECT * FROM Shop WHERE nazwa = '${owoc}'`).catch((err) => { throw err })
                    let check = await promiseQuery(`SELECT nazwa FROM Koszyk WHERE nazwa = '${owocMySQL[0]["nazwa"]}' AND UserID ='${UzytkownikID}'`)
                    //Sprawdzanie czy przedmiot sie nie powtarza
                    if (check.length === 0) {
                        await promiseQuery(`INSERT INTO Koszyk (nazwa,cena, Userid)
                        VALUES ('${owocMySQL[0]["nazwa"]}', '${owocMySQL[0]["cena"]}', '${UzytkownikID}');   
                        `).catch((err) => { })
                    }

                    res.writeHead(302, { 'Location': "/" })
                    res.end();

                });

            }

            break
        //Zapytanie wyciagające dane dla fetcha w appPodsumowanie.js
        case "/danePodsumowanie":

            if (req.method == "GET") {
                let zapytaniePromis = await promiseQuery(`SELECT * FROM podsumowanie WHERE UserID = ${UzytkownikID}`)

                for (i = 0; i < zapytaniePromis.length; i++) {
                    let zapCena = await promiseQuery(`SELECT cena FROM Shop WHERE nazwa = '${zapytaniePromis[i].nazwa}'`)
                    zapytaniePromis[i].cena = zapCena[0]["cena"]

                    let zapUser = await promiseQuery(`SELECT  Imie,miejscowosc,kodPocztowy,UlNr FROM User WHERE id = '${UzytkownikID}'`)
                    let zapLista = await promiseQuery(`SELECT id FROM podsumowanie WHERE UserID = '${UzytkownikID}'`)

                    zapytaniePromis[i].imie = zapUser[0]["Imie"]
                    zapytaniePromis[i].miejscowosc = zapUser[0]["miejscowosc"]
                    zapytaniePromis[i].kodPocztowy = zapUser[0]["kodPocztowy"]
                    zapytaniePromis[i].UlNr = zapUser[0]["UlNr"]
                    zapytaniePromis[i].zaplista = zapLista[0]["id"]
                }


                res.end(JSON.stringify(zapytaniePromis))
            }
            break
        case "/podsumowanieStrona":
            if (req.method == "GET") {
                readFile("/podsumowanie.html", res, req)

            }
            break

        default:

            let url = req.url
            if (url.startsWith('/src-web')) {
                url = url.substr("/src-web".length, url.length - "/src-web".length)
            }

            readFile(url, res, req)
            break;
    }

});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});


//Połaczenie z baza danych 
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bazar"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Połączony z baza mySQL");

});



//Dodawanie przedmiotow do koszyka oraz tworzenie strony
function koszyk(res, UzytkownikID) {

    let hold = ""

    con.query(`SELECT * FROM Koszyk WHERE UserId = 
    '${UzytkownikID}'`, async (err, rows) => {
        if (err) throw err;


        for (i = 0; i < rows.length; i++) {
            let iloscShop = await promiseQuery(`SELECT ilosc FROM Shop WHERE nazwa = '${rows[i]["nazwa"]}'`)
            hold += `   <div class = "flex">    
            <li class="main" >Nazwa: ${rows[i]["nazwa"]} </li>
            <li class="main" > Cena: ${rows[i]["cena"]} </li>
            <li class="main" > Ilość: ${iloscShop[0]["ilosc"]} </li>
           
            <input class = "inputCena" id = "${rows[i]["nazwa"]} "  type="number">
            <li id = "${rows[i]["nazwa"]}x"  class = 'x' ></li>
           <li id = "${rows[i]["nazwa"]}y"  class = 'y'></li>
            </div>
            <br>
           `

        }

        fs.readFile(__dirname + '/src-web' + '/Engage.html', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            tableFront = `<!DOCTYPE html>
                        <html lang="en">
                        
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>
                            <link rel="stylesheet" href="stylekoszyk.css">
                        </head>
                        
                        <body>
                            <header>
                               <a id="logo" href="/"></a>
                            </header>
                            <article id = "art">
                        
                                <ol>
                                                                 
                        ${hold}`

            tableEnd = `</ol>
              
            <div id = "summary"> 


            <button type="submit" id = "kup" >Kup</button>
            </div>


                    </article>
                    <footer></footer>
                
                
                    <script src="../appKoszyk.js" defer></script>
                </body>
                
                </html>`
            data = data.replace("<placeholder>", tableFront)
            data = data.replace("</placeholder>", tableEnd)

            res.end(data)



        });

    });

}
