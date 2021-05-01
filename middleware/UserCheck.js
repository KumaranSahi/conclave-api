const usersdb=require('../models/User.model');

const userCheck=async (req,res,next)=>{
    const {id}=req.params;
    try{
        if(await usersdb.findById(id)){
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
            message:"Could not "
        })
    }
}

module.exports=userCheck;