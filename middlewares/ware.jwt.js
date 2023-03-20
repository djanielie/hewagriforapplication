const jwt = require("jsonwebtoken");

const onSignIn = async ({ payload }, req, res, next) => {
    await jwt.sign(
        { user: admin }, 
        "zaqxswcde",
        // , { algorithm: 'RS256' }, 
        function(err, token) {
            console.log(" Token generated is => ", token);
            // if(token) return Response(res, 200, admin);
            // else return Response(res, 500, err);
        }
    );
};

const onVerify = async ({  }) => {

};

module.exports = {
    onSignIn,
    onVerify
}
