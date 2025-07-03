const validateSignUpData=(req)=>{
    const {firstName, lastName}=req.body;
    if(!firstName || !lastName){
        throw new Error("Mention Your Name!!");
    }
}

const validateEditProfileData=(req)=>{
    const data=req.body;
    const ALLOWED_UPDATE_FEILDS=['age', 'gender', 'photoUrl', 'skills', 'about'];

    const isAllowedUpdate=Object.keys(data).every((k)=> ALLOWED_UPDATE_FEILDS.includes(k));
    return isAllowedUpdate;
}

module.exports={
    validateSignUpData,
    validateEditProfileData,
}