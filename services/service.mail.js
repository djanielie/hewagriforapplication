const { CourierClient } = require("@trycourier/courier");
const dotenv = require("dotenv");

dotenv.config();

const courier = CourierClient({authorizationToken: process.env.APPCOURIERKEY});
        
const sendMail = async ({code, to, title, body}, cb) => {
    try {
        const { requestId } = await courier.send({
            message: {
              content: {
                title: title ? title : "HewAgri | Code de Vérification",
                body: body ? body : `Votre code vérification est : ${code} pour l'hautentification à l'application ${process.env.APPNAME}`
              },
              data: {
                joke: "No Joke today Dav"
              },
              to: {
                email: to.toLowerCase()
              }
            }
        });
        if(requestId) cb(undefined, requestId);
        else cb('error on sending mail', undefined);
    } catch (error) {
        cb(error, undefined)
    }
}

const onSendMail = async ({ to, content }, cb) => {
  try {
      const { requestId } = await courier.send({
          message: {
            content: {
              title: title ? title : "Configurations | Alerte",
              body: content
            },
            data: {
              joke: "No Joke today Dav"
            },
            to: {
              email: to.toLowerCase()
            }
          }
      });
      if(requestId) cb(undefined, requestId);
      else cb('error on sending mail', undefined);
  } catch (error) {
      cb(error, undefined)
  }
}
 
module.exports = {
    onSendMail,
    sendMail
}