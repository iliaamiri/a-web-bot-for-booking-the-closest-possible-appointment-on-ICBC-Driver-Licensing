# A Web Bot for Booking the Closest Possible Appointment on ICBC Driver Licensing

This bot snipes the closest time (based on your logic) for an ICBC Road Test.

## Pre-requisites and Installations
1. You only need to install Node.js (https://nodejs.org/en/download/)

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
   In `config.js` use any of these 4 syntaxes to filter out the dates you want to book your appointment on: 
![image](https://user-images.githubusercontent.com/37903573/174266593-7238facc-b7b2-412f-b14a-f9a660c388ea.png)

5. There are other configurations you can change in `config.js` as well. Feel free to take a look at and maybe change them as you see fit.

## For it to automatically read your email inbox, enable the IMAP protocol and turn on the "allow for less-secure apps" in your settings.
For Gmail:
* https://support.google.com/accounts/answer/6010255?hl=en
* https://support.google.com/mail/answer/7126229?hl=en#zippy=

**Update**❗❗: Gmail updated their security policies. So, now you have to make sure you enabled your 2-step-verification on your gmail. And refer to this link to setup and use "App Passwords": https://support.google.com/accounts/answer/185833

In the App Password setting, select the "Other" option from the drop down (see the image below):
![image](https://user-images.githubusercontent.com/37903573/176601798-283ee36f-1e89-4ca9-bfa5-2da40232a418.png)

Then pick a name (whatever you want) and just click "Generate". You'll get a random generated password. Copy that and use it as your IMAP password in `config.js`.

* You then will use your App Password instead of your regular gmail password, in the `config.js`

## aaaaand.. Run it 🤖
```
npm install
npm run start
```

### How does Success Message look like:

![success message](https://user-images.githubusercontent.com/37903573/173990985-2a869a38-d67b-4a63-bfb4-38c2d9f3efa8.png)
