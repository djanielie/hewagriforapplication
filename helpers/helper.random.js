const randomstring = require("randomstring");
const dotenv = require('dotenv');
const { CustomizedSMS } = require("../models/model.cutsomizedsms");

dotenv.config();

const generateIdentifier = ({ prefix }) => {
    const pfx = Math.floor(Math.random() * 1000);
    const sfx = Math.floor(Math.random() * 100);
    
    return `${prefix ? prefix : "REF"}-${pfx}-${sfx}`;
};

const generateFilename = ({ prefix, tempname }) => {
    const extension = tempname.substring(tempname.lastIndexOf("."));
    return `${prefix ? prefix : ""}${randomstring.generate()}${extension}`;
};

const randomLongNumber = ({ length }) => {
    const len = length && !isNaN(parseInt(length)) ? length : 6;
    const ret = [];

    for(let k = 0; k < len; k++) ret.push(
       Math.floor( Math.random() * 10 )
    );
    
    let m = ret.join().toString();
    m = m.replace(/,/g, "");
    return m.trim();
};

const genenateMultilangueTemplate = ({ message, concerne: { fsname, lsname, password, code, champsname, packet } }) => {
    let m = "";

    try {

        message = message.replace("#", fsname );  // 1. nom
        message = message.replace("##", lsname ); // 2. postnom
        message = message.replace("#$#", password ); // 3. prenom
        message = message.replace("#$$#", code ); // 4. code
        message = message.replace("#$$$#", champsname ); // 5. nom du champ   
        message = message.replace("#$$$$#", packet ); // 6. packet
        
        return m = message;
        
    } catch (error) {
        return ""
    }
};

const generateMessageTemplate = ({ decision, agriculteur, decisionTomorrow, champsname, nbmessage, CustomizedSMS }) => {
    let message = String("");
        if(1){

        // 1: # Name.
        // 2: ## Decision.
        // 3: #$# tomorrowDecision.
        // 4: #$$# champsName.
        // 5: #$$$# soldeMessage.
        
        message = CustomizedSMS;

        message = message.replace("#", agriculteur );  // 1.
        message = message.replace("##", decision ); // 2.
        message = message.replace("#$#", decisionTomorrow ); // 3.
        message = message.replace("#$$#", champsname ); // 4.
        message = message.replace("#$$$#", nbmessage ); // 5.

        return message;

    }else return `Bonjour ${agriculteur} aujourd'hui il y aura probablement ${decision}, demain il y aura probablement ${decisionTomorrow}! sur votre champs de ${champsname}, Solde: ${nbmessage}` 
};

const returnDayOfTheWeekFromNumber = ({ dayNumber }) => {
    switch (parseInt(dayNumber)) {
        case 0:
            return "Lundi";
            break;
        case 1:
            return "Mardi";
            break;
        case 2:
            return "Mercredi";
            break;
        case 3:
            return "Jeudi";
            break;
        case 4:
            return "Vendredi";
            break;
        case 5:
            return "Samedi";
            break;
        case 6:
            return "Dimanche";
            break;
        default:
            return "Not specific";
            break;
    }
};

module.exports = {
    genenateMultilangueTemplate,
    returnDayOfTheWeekFromNumber,
    generateMessageTemplate,
    randomLongNumber,
    generateFilename,
    generateIdentifier
}