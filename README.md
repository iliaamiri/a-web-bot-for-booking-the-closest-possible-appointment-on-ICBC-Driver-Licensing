# A Web Bot for Booking the Closest Possible Appointment on ICBC Driver Licensing

This bot snipes the closest time (based on your logic) for an ICBC Road Test.

The philosophy of this software is that you have this automated tool that refreshes the page and books you an appointment close to when you want because some other person decided to cancel their appointment for whatever reason. Instead of you manually refreshing the page to find that open spot, this script automates that for you. That's all.

## Pre-requisites and Installations
1. Basic knowledge of:
    - Working with Command Line interface
    - Basic knowledge of JavaScript
    - Basic knowledge of Node.js and NPM
3. You need to install Node.js (https://nodejs.org/en/download/)

## Setup the bot

1. Rename the config-sample.js to config.js 
2. Replace your ICBC credentials with the placeholders, and for automating the whole process, setup your email's IMAP protocol and replace the placeholders with your creds in config.js as well.
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
