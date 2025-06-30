const validateSignUpData=(req)=>{
    const {firstName, lastName}=req.body;
    if(!firstName || !lastName){
        throw new Error("Mention Your Name!!");
    }
}

module.exports={
    validateSignUpData,
}