const { default: mongoose } = require('mongoose');

mongoose.connect("mongodb+srv://xlrx7841_db_user:A49GeWjqD1MZkHHX@cluster0.2ckkjz6.mongodb.net/trello");

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