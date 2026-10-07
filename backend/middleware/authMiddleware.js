import jwt from 'jsonwebtoken'


export const authMiddleware=async(req,res,next)=>{
    
    
    try{
        const token=req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                message:"Access token required"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        res.status(401).json({
            message:"Invalid or expired access token",
            err:err.message
        })
    }
}