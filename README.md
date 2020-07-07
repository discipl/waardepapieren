# Waardepapieren

This project provides a full implementation example of how Discipl components can be used to issue and
verify claims. In particular, how municipalities can issue

## Preparation

In order to make everything functional, we need to generate valid certificates for demo NLX environments and
ensure that the validation app can retrieve those. This is only needed for working with live NLX, when using `docker-compose-travis.yml`, these certificates are not needed.

1. Generate certificates as described [here](https://docs.nlx.io/try-nlx/retrieve-a-demo-certificate/), and place the `org.key` and `org.crt` files at `./mock-nlx/certs/`
2. Ensure the certificates are readable, for example by giving the following permissions `chmod g+r org.key`

## Running

The easiest way to run is using docker-compose:

This will start 3 applications:

- clerk-frontend
- waardepapieren-service, with embedded ephemeral-server
- nlx-mock, which is a mocked nlx-service

This is done as follows:

1. Set the environment variable CERT_HOST_IP is with an IP (or domain) that the validator app can use to reach
   the clerk-frontend container. Ensure that the validator app runs on the same (wifi) network as the clerk frontend.
2. Run `docker-compose -f docker-compose-travis.yml up`

Alternatively, you can use a live NLX version (unmaintained configuration):

1. Run `docker-compose up`


The clerk frontend will be available at `https://localhost:443`

# Running validator
The validator app is made with [Expo](https://expo.io/), which is a free and open-source react-native framework for mobile development. to run this on a mobile device, the expo-cli tool is required. to install this, run:
```bash
$npm install -g expo-cli
```
connect to the same network without firewall restrictions (if all else fails, starting an hotspot on your mobile device and connecting to it usually works). In the folder "validator-frontend", issue the command:
```bash
$expo start
```
wait till the program has fully loaded and scan the QR code in the left bottom corner, with the Expo-app for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) or [IOS](https://itunes.apple.com/us/app/expo-client/).



# Basic Flow (Main Succes Scenario)

Dit document heeft als doel om zowel het ontwikkelteam als de gemeente een duidelijk beeld 
te geven van de  applicatie, middels een volledig implementatievoorbeeld van hoe Discipl-componenten 
kunnen worden gebruikt  om claims af te geven en te verifiëren. In het bijzonder, hoe gemeenten die kunnen uitgeven. .

Architectuur en Hardware
Om waardepapieren op te zetten gaan we in onze situatie een Docker instantie draaien. Deze Docker instantie zal in dit geval moeten draaien op een server 
bij de gemeente of in de cloud (Azure)  De innovatie-proeftuin https://zuidugchelen.eu (macOS sierra) biedt de mogeljkheid om laagdrempelig 
nieuwe innovatieve ideeen uit te proberen. 


***
1. gemeentelijk ambtenaar klikt op https://zuidugchelen.eu en opent de clerk-frontend 

***
2. Systeem laat hoofdscherm zien.
![hs1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_01.png)

***
3. gemeentelijk abmtenaar tikt magisch nummer in (anders dan in screenshot: BSN=999994669)
![hs2](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_02.png)
gemeenteambtenaar klikt op volgende

***
4. Systeem laat doelbinding zien
![hs3](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_03.png)
gemeentelijk ambtenaar klikt op volgende

***
5. Systeem laat detailpagina zien van de ingevoerde BSN

![hs4](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_04.png)

(nb op IOS mobile (iphone/ipad) gebeurt dit nog niet )
gemeenteambtenaar klikt op *dit klopt!*

***
6. systeem laat uittreksel zien
![hs5](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_05.png)

***
7. Gemeentelijk ambtenaar  klikt op download

![hs15](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_07.png)

***
8. Systeem laat downloadscherm zien

![hs5](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_15.png)

[uittreksel](https://github.com/discipl/waardepapieren/blob/master/pictures/uittreksel.pdf)

***
9. Burger` koppelt` qr-code aan Wallet of neemt printje mee, gemeentelijk ambtenaar klikt op afronden
   
![hs10](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_07.png)
nb  `download apple-wallet` werkt nog niet
***
10. Systeem laat weer het hoofdscherm zien. ` Serving needs`
![hs1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_01.png)

Er is nu een automatisch gegenereerd document en daarom niet ondertekend.  
De gegevens zijn verkregen via NLX en geborgd in de QR code. De validatie_app is bedoeld om de echtheid te controleren .

# Validatie waardepapieren_app met expo 

***

![Qr code](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_08.PNG)

Met een standaard qr lezer kan bovenstaande QR code worden gescand, en de JSON code zichtbaar worden gemaakt.

![c1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_09.png)

***

JSON is een internetcommunicatiestandaard vanwege de eenvoudige integratie met JavaScript en het flexibele formaat, maar vereist codering om toegang te krijgen tot de gegevens in een JSON-document. Met Expo kunnen webontwikkelaars echt native apps bouwen die zowel op iOS als Android werken door ze èènmaal in JavaScript te schrijven.

https://apps.apple.com/nl/app/expo-client/id982107779
![Expo](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_10.PNG)

![c1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_11.png)

***

![c1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_12.png)

Scan [ ] nogmaals de QR code

***

![c1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_13.png)

***
![c1](https://github.com/discipl/waardepapieren/blob/master/pictures/hbs20191010_14.png)


