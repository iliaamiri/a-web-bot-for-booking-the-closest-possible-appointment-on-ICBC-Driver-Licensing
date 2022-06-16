# A Web Bot for Booking the Closest Possible Appointment on ICBC Driver Licensing
This bot snipes the closest time (based on your logic) for an ICBC Road Test.

## Setup
```
npm install
npm run start
```

## Setup and run the Selenium server
There are two options:

### 1. No docker - Bare-bone on the OS _(Less Complicated)_
You may refer to this repo that has some varieties of Selenium setups:
* For Windows users: https://github.com/iliaamiri/selenium-setup-dependencies/tree/v4-windows-firefox
* For Linux users: https://github.com/iliaamiri/selenium-setup-dependencies/tree/v4-linux-firefox

### 2. via Docker
You may refer to this docker container (or any other one you'd want) and instantly setup the selenium: https://github.com/iliaamiri/selenium-on-Linux-setup-dependencies


## Setup the bot

1. Rename the config-sample.js to config.js 
2. Replace your ICBC credentials with the placeholders, and for automating the whole process, setup your email's IMAP protocol and replace the placeholders with your creds in config.js as well.
3. Give the right port number and server ip of the Selenium server in config.js (if it's on your localhost, just leave it as is).  
  ❗**Don't forget to keep that `config.js` file safe from any accesses**❗

4. Change the logic to your favour  
   Go to `src/approvementLogic.js` and use any of these 4 syntaxes to filter out the dates you want to book your appointment on: 
![image](https://user-images.githubusercontent.com/37903573/173935970-b719f7e3-bbfc-4927-a5ba-c589d6381002.png)

## For it to automatically read your email inbox, enable the IMAP protocol and turn on the "allow for less-secure apps" in your settings.
For Gmail:
* https://support.google.com/accounts/answer/6010255?hl=en
* https://support.google.com/mail/answer/7126229?hl=en#zippy=

### How does Success Message look like:
![success message](/git_img/success-message.png)
