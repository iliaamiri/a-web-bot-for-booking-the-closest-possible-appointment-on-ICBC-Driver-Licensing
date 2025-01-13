import Imap from "imap";
import { simpleParser } from "mailparser";

import { email, passwordOfEmail, imapServer, imapPort } from "../config.js";

const imapConfig = {
  user: email,
  password: passwordOfEmail,
  host: imapServer,
  port: imapPort,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

export const getVerificationCode = () =>
  new Promise((resolve, reject) => {
    try {
      const imap = new Imap(imapConfig);
      imap.once("ready", () => {
        imap.openBox("INBOX", true, () => {
          imap.search(["UNSEEN", ["SUBJECT", "Verification code to book a road test"]], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve("No Email");

            const theResults = [results[results.length - 1]];

            const f = imap.fetch(theResults, { bodies: "" });

            f.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, async (simpleParserErr, parsed) => {
                  if (simpleParserErr) {
                    return reject(simpleParserErr);
                  }
                  const { html } = parsed;
                  // const beginningString = "<h2 style=\"font-family:&#39;Montserrat&#39;,helvetica neue,helvetica,arial,verdana,sans-serif;font-size:20px\">";
                  console.log(html);
                  const verificationCode = html.match(/;font-size:20px">(.*)<\/h2>/);

                  if (verificationCode !== null) {
                    return resolve(verificationCode[1]);
                  }
                });
              });
              msg.once("attributes", (attrs) => {
                const { uid } = attrs;
                imap.addFlags(uid, ["\\Seen"], () => {
                  console.log("Email has been marked as read.");
                });
              });
            });
            f.once("error", (ex) => reject(ex));
            f.once("end", () => {
              console.log("Done fetching All messages");
              imap.end();
            });
          });
        });
      });

      imap.once("error", (err) => reject(err));

      imap.once("end", () => {
        console.log("Connection ended");
      });

      imap.connect();
    } catch (e) {
      return reject(e);
    }
  });

try {
  const result = await getVerificationCode();
  console.log("result", result);
} catch (e) {
  console.log(e);
  console.log(imapConfig);
  console.log(`ERROR:`, e);
}
