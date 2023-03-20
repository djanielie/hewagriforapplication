const onSynchoniseAgriculteurs = async ({ data }) => {

};

const onSynchoniseChamps = async () => {

};

const onSynchronize = async ({ data, type }) => {
    if(type === "_ASAGRIS"){ // import agriculteurs
        await onSynchoniseAgriculteurs({ data })
    }
    if(type === "_ASCHMPS"){ // import champs
        await onSynchoniseChamps({ data })
    }
};

const onImportDataFromEXCEL = async () => {

}

module.exports = {
    onImportDataFromEXCEL,
    onSynchronize,
    onSynchoniseAgriculteurs,
    onSynchoniseChamps
}