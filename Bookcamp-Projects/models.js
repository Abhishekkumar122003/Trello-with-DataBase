const { default: mongoose } = require('mongoose');

mongoose.connect("");

// Design Schema

const UserSchema = new mongoose.Schema({
    // _id -> mongoose provided this automaticaly
    username:String,
    password:String,
})

const OrganizationSchema = new mongoose.Schema({
    title:String,
    description:String,
    admin:mongoose.Types.ObjectId,
    members:[mongoose.Types.ObjectId]
});

const userModel = mongoose.model("user" , UserSchema);
const organizationModel = mongoose.model("organization" , OrganizationSchema);

module.exports= {
    userModel,
    organizationModel

}