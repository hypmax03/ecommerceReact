import jwt from 'jsonwebtoken'


export const authMiddleware=async(req,res,next)=>{
    
    
    try{
        const token=req.cookies.accessToken;
    console.log(req.cookies);
        if(!token){
            res.status(401).json({
                message:"Access token required"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        res.status(500).json({
            message:"Server error",
            err:err.message
        })
    }
}