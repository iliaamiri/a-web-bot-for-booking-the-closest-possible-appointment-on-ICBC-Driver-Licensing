# A Web Bot for Booking the Closest Possible Appointment on ICBC Driver Licensing
This bot snipes the closest time (based on your logic) for an ICBC Road Test.

## Setup
```
npm install
npm run start
```

## Rename the config-sample.js to config.js 
Replace your ICBC credentials with the placeholders, and for automating the whole process, setup your email's IMAP protocol and replace the placeholders with your creds in config.js as well.

## Setup and run the Selenium server and give the right port number and server ip in config.js

### You may refer to this docker container I made and instantly setup the selenium: https://github.com/iliaamiri/selenium-on-Linux-setup-dependencies

*!!! don't forget to keep that config.js file safe from any accesses !!!*

## Change the logic to your favour
Go to `src/approvementLogic.js` and use any of these 4 syntaxes to filter out the dates you want to book your appointment on: 
![image](https://user-images.githubusercontent.com/37903573/173935970-b719f7e3-bbfc-4927-a5ba-c589d6381002.png)

`dateText` is the date text of the latest result, which is being evaluated.  
`date` is a Date instance based of the `dateText`

## For it to automatically read your email inbox, enable the IMAP protocol and turn on the "allow for less-secure apps" in your settings.
For Gmail:
* https://support.google.com/accounts/answer/6010255?hl=en
* https://support.google.com/mail/answer/7126229?hl=en#zippy=

### How does Success Message look like:
![success message](/git_img/success-message.png)
