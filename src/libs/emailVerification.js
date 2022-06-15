const Imap = require('imap');
const {simpleParser} = require('mailparser');

const {
    email,
    passwordOfEmail,
    imapServer,
    imapPort
} = require('../config');

const imapConfig = {
    user: email,
    password: passwordOfEmail,
    host: imapServer,
    port: imapPort,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

const getVerificationCode = () => {
    return new Promise((resolve, reject) => {
        try {
            const imap = new Imap(imapConfig);
            imap.once('ready', () => {
                imap.openBox('INBOX', true, () => {
                    imap.search(['UNSEEN', ['FROM', "roadtests-donotreply@icbc.com"], ['SINCE', new Date()], ['SUBJECT', "Verification code to book a road test"]], (err, results) => {
                        if (err)
                            return reject(err);
                        if (results.length === 0)
                            return resolve("No Email");

                        results = [results[results.length - 1]];

                        const f = imap.fetch(results, {bodies: ''});

                        f.on('message', msg => {
                            msg.on('body', stream => {
                                simpleParser(stream, async (err, parsed) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    let html = parsed.html;
                                   // const beginningString = "<h2 style=\"font-family:&#39;Montserrat&#39;,helvetica neue,helvetica,arial,verdana,sans-serif;font-size:20px\">";

                                    const verificationCode = html.match(/;font-size:20px">(.*)<\/h2>/)

                                    if (verificationCode !== null) {
                                        return resolve(verificationCode[1])
                                    }
                                })
                            });
                            msg.once('attributes', attrs => {
                                const {uid} = attrs;
                                imap.addFlags(uid, ['\\Seen'], () => {
                                    console.log("Email has been marked as read.");
                                })
                            })
                        })
                        f.once('error', ex => {
                            return reject(ex);
                        })
                        f.once('end', () => {
                            console.log('Done fetching All messages')
                            imap.end()
                        })
                    })
                })
            })

            imap.once('error', err => {
               return reject(err);
            })

            imap.once('end', () => {
                console.log("Connection ended");
            })

            imap.connect();
        } catch (e) {
            return reject(e)
        }
    })
}

// getVerificationCode().then((result) => {
//     console.log(result)
// }).catch(err => {
//     console.log("FUCKING ERROR:" + err)
// }).catch(err => console.log("WATAAAAA"))

module.exports = {
    getVerificationCode
}