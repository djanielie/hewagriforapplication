const fillphone = ({ phone }) => {
    switch (phone.charAt(0)) {
        case 0: return String(phone);
        case '0': return String(phone);
        case '+': return String(`0${phone.substring(4)}`);
        case 2: return String(`0${phone.substring(3)}`);
        default: return String(`0${phone}`);
    }
}

const completeCodeCountryToPhoneNumber = ({ phone }) => {
    phone = phone ? phone.toString() : '0';
    const cdcode = '243'
    switch (phone.charAt(0)) {
        case '0':
            return String(`${cdcode}${phone.substring(1)}`);
            break;
        case '+':
            return String(`${cdcode}${phone.substring(4)}`);
            break;
        case '2':
            return String(`${cdcode}${phone.substring(3)}`);
            break;
        default:
            return String(`${cdcode}${phone.substring(1)}`);
            break;
    }
}

module.exports = {
    fillphone,
    completeCodeCountryToPhoneNumber
}