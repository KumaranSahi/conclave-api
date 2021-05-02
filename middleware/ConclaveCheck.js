const conclavesdb=require('../models/Conclave.model');

const conclaveCheck=async (req,res,next)=>{
    const {conclaveId}=req.params;
    try{
        if(await conclavesdb.findById(conclaveId)){
            next()
        }else{
            return res.status(404).json({
                ok:false,
                message:"Data not found"
            })
        }
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Internal server error"
        })
    }
}

module.exports=conclaveCheck;