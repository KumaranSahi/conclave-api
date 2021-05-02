const conclavesdb=require('../models/Conclave.model')
const usersdb=require('../models/User.model')
const messagesdb=require('../models/Message.model');

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
    const {name,description,image}=req.body;
    try{
        let conclave
        if(image){
            conclave=await conclavesdb.create({
                name:name,
                description:description,
                admin:id,
                image:image,
                visibility:"PRIVATE",
                active:true
            })
        }else{
            conclave=await conclavesdb.create({
                name:name,
                description:description,
                admin:id,
                image:null,
                visibility:"PRIVATE",
                active:true
            })
        }
        const user=await usersdb.findById(id);
        user.createdConclaves.push(conclave.id);
        await user.save();
        return res.status(201).json({
            ok:true,
            data:conclave,
            currentConclave:conclave,
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

module.exports.getAllConclaveMessages=async (req,res)=>{
    const {conclaveId}=req.params;
    try{
        const conclave=await conclavesdb.findById(conclaveId)
        const newMessage=await conclave.execPopulate({path:'messages',populate:([{path:'by'},{path:"responseOf",populate:({path:'by'})}])})
        return res.status(201).json({
            ok:true,
            data:[...newMessage.messages],
            message:"Have some conclave messages"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not create conclave"
        })
    }
}

module.exports.changeConclaveVisibility=async (req,res)=>{
    const {conclaveId}=req.params;
    const {visibility}=req.body
    try{
        await conclavesdb.findByIdAndUpdate(conclaveId,{visibility:visibility})
        const conclave=await conclavesdb.findById(conclaveId)
        return res.status(201).json({
            ok:true,
            data:conclave,
            message:"Have some conclaves"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not update conclave"
        })
    }

}

module.exports.addBookmark=async (req,res)=>{
    const {conclaveId,id}=req.params;
    try{
        const user=await usersdb.findById(id);
        if(!user.bookmarkedConclaves.some(conId=>conId==conclaveId)){
            await user.bookmarkedConclaves.push(conclaveId)
            await user.save()
        }
        return res.status(201).json({
            ok:true,
            message:"bookmark added"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not add bookmark"
        })
    }
}

module.exports.getBookmarked=async(req,res)=>{
    const {id}=req.params;
    try{
        const userConclaves=await (await usersdb.findById(id)).execPopulate('bookmarkedConclaves')
        return res.status(200).json({
            ok:true,
            data:[...userConclaves.bookmarkedConclaves],
            message:"Have some conclaves"
        })
    }catch(error){
        console.log(error);
        return res.status(503).json({
            ok:false,
            message:"Could not load conclaves"
        })
    }
}