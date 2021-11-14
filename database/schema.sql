CREATE DATABASE bazar DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;

USE bazar;

CREATE TABLE Shop(
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
   nazwa VARCHAR(30) NOT NULL,
   ilosc INT(255),
   cena DECIMAL(13, 2)
   );

INSERT INTO Shop (nazwa, ilosc, cena) 
   VALUES ('Jablka', '60', "2.59"), 
   ('Kaiserka', '100', "0.99"), 
   ('Pomidory', '100',"7.99" ),
   ('Jajka', '80',"5.99"), 
   ('Maslo', '140', "3.99"),
   ('Mleko', '50', "2.99"),
   ('Cebula', '30', "1.99"),   
   ('Olej', '60',  "8.99");

CREATE TABLE User(
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
   Imie VARCHAR(30) NOT NULL,
   Nazwisko VARCHAR(30) NOT NULL,
   Email VARCHAR(30) NOT NULL,
   Miejscowosc VARCHAR(30) NOT NULL,
   kodPocztowy VARCHAR(30) NOT NULL,
   UlNr VARCHAR(30) NOT NULL,
   Login VARCHAR(30) NOT NULL UNIQUE,
   Haslo VARCHAR(255) NOT NULL);

CREATE TABLE Koszyk(
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
   nazwa VARCHAR(30) NOT NULL,
    cena DECIMAL(13, 2),
   UserID int,
   FOREIGN KEY (UserID) REFERENCES User(id)
   );
CREATE TABLE podsumowanie(
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
   nazwa VARCHAR(30) NOT NULL,
   ilosc INT(255),
   UserID int,
   FOREIGN KEY (UserID) REFERENCES User(id)
   );



