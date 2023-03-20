const convertUnixToDate = ({ unix }) => {
    return {
        date : new Date(unix * 1000).toLocaleDateString(),
        unix
    }
};

const onGetAmountFromTypeSouscription = ({ type }) => {
    const t = type;
    
};

const checkIfCanPayWithPackage = ({ type, nbPackage }) => {
    console.log("====== Received info | For paiement avec paquet Type => ", type, " Messages => ", nbPackage * 30 );
    switch (parseInt(type)) {
        case 1:
            if((nbPackage * 30) >= 30) return true;
            else return false;
            break;

        case 2:
            if((nbPackage * 30) > 90) return true;
            else return false;
            break;

        case 3:
            if((nbPackage * 30) > 180) return true;
            else return false;
            break;

        case 4:
            if((nbPackage * 30) > 360) return true;
            else return false;
            break;
    
        default:
            return false;
            break;
    }
};

module.exports = {
    checkIfCanPayWithPackage,
    onGetAmountFromTypeSouscription,
    convertUnixToDate
}