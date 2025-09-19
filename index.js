const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://meenakshi:meena123@cluster0.lvaaenk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connect")
    
})

const credential = mongoose.model("credential",{},"bulkmail")



app.post("/sendmail",function(req,res){

    const msg = req.body.msg
    const emailList = req.body.emailList



credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
    service:"gmail",
   auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
})

new Promise(async function(resolve,reject){

    try{
for( let i=0;i<emailList.length;i++)
{
await transporter.sendMail({
    from:data[0].toJSON().user,
    to:emailList[i],
    subject:"A message from Bulk Mail App",
    text:msg

})
console.log("Email sent to"+emailList[i]);


}
resolve("success")
}
catch(error)
{
    reject(error)
}


})
.then(function(){
    res.send(true)
}).catch(function(){
    res.send(false)
})

})
.catch(function(error)
{
    console.log(error)
    
})


})



app.listen(5000,function(){
    console.log("server started...")
    
})