import jwt from 'jsonwebtoken'
const secret ='@p1a2p3p4y5k1a2i3f4'


function createTokenForUser(user){
    const payload ={
        _id:user._id,
        name:user.fullName,
        email:user.email,
        profilImageUrl:user.profilImageUrl,
        role:user.role,
    }
    const token=jwt.sign(payload,secret)
    return token;
}
function validateToken(token){
    const payload = jwt.verify(token,secret)
    return payload
}

export {createTokenForUser,validateToken}