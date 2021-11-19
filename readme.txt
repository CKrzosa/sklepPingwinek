Aby uruchomić projekt należy mieć zainstalowanego:
MySQL 8.0
Node.js
Konfiguracja:

Na początku należy odpalić mysql i wygenerować bazę danych znajdującą się w pliku schema.sql. 
Baza danych powinna mieć ustawione hasło oraz login na root/root, inaczej projekt się nie odpali.

Następnie w konsoli przejść do folderu src i za pomocą komendy npm install zainstalować wszystkie zależności projektu. 
Gdy pobieranie dobiegania końca w terminalu wpisać komendę node app.js, która uruchomi aplikację. 
W konsoli powinien znaleźć się link do przeglądarki, który należy uruchomić lub wkleić http://localhost:8000/ .

Opis Projektu
Aplikacja jest uproszczonym sklepem internetowym. Po uruchomieniu na stronie widzimy 8 zdjęć produktów z podaną cenną oraz ilością dostępnych sztuk. 
Aby móc dokonać zakupów musimy najpierw się zarejestrować, a następnie zalogować (przycisk prawy górny róg).
Teraz możemy za pomocą przycisków dodawać przedmioty do koszyka.
Aby je zakupić trzeba kliknąć w ikonkę koszyka (na środku górnego paska), a następnie zostaniemy przeniesieni do podstrony, 
na której wybieramy ile danych produktów chcemy zakupić.
Po zakupie zostaniemy przekierowani na stronę podsumowania.
Tutaj pokazane są wszystkie produkty, które do tej pory zakupiliśmy oraz ich łączna cena i dane do dostawy.
Po kupnie produktów dalej możemy kontynuować zakupy. 
W każdej chwili możemy sprawdzić dotychczas zakupione produkty gdyż obok koszyka pojawi się nowa ikona przekierowująca do podsumowania.  

	
