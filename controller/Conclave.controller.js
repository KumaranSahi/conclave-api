const conclavesdb=require('../models/Conclave.model')
const usersdb=require('../models/User.model')

module.exports.getAllConclaves=async (req,res)=>{
    try{
        const conclaves=await conclavesdb.find();
        const data=conclaves.length>0?conclaves.filter(({active,visibility})=>{
            if(active||visibility==="PUBLIC")
                return true;
            return false;
        }):[]
        return res.status(200).json({
            ok:true,
            data:data,
            message:"Have some conclaves"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not create conclave"
        })
    }
}

module.exports.getUserConclave=async (req,res)=>{
    const {id}=req.params;
    try{
        const userConclaves=await (await usersdb.findById(id)).execPopulate('createdConclaves')
        return res.status(200).json({
            ok:true,
            data:[...userConclaves.createdConclaves],
            message:"Have some conclaves"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not create conclave"
        })
    }
}

module.exports.createConclave=async (req,res)=>{
    const {id}=req.params;
    const {name,description}=req.body;
    try{
        const conclave=await conclavesdb.create({
            name:name,
            description:description,
            admin:id,
            visibility:"PRIVATE",
            active:true
        })
        const user=await usersdb.findById(id);
        user.createdConclaves.push(conclave.id);
        await user.save();
        return res.status(201).json({
            ok:true,
            data:conclave,
            message:"Conclave created successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not create conclave"
        })
    }
}