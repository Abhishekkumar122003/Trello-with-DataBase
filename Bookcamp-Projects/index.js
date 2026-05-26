const express = require('express');
const json = require("jsonwebtoken")
const SECRET = "ramsdomdsfmyfirstlovetoyopurnsdiudontknowyetcitnwascyopu";

const app = express();
app.use(express.json());
const {userModel , organizationModel} = require("./models")
const {authMiddleware} = require('./middleware')

// -------------  for unique identification --------

const  BOARD_ID=1;
const ISSUES_ID=1;

//  -------------- from here ------------------------------


const BOARD = [];
const ISSUES = [];

// ------- to this is part of database designing ----------------------------------------

// ---------post endpoint
app.post("/signup", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    const userexist = await  userModel.findOne({
        username:username,
        
       
    });
// console.log(userModel.username + " "+ userModel.password)
    if(userexist){
        res.status(403).send({
            message:"user with this name already exists"
        })
        return 
    }
    const newUser = await userModel.create({
        username: username,
        password:password,
    })
    // console.log(newUser.password)
    res.json({
        message:"you have signed up successfully"
    })

});

app.post("/signin", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const userexist = await userModel.findOne({
        username:username, 
        password:password

    })
    if(!userexist){
        res.status(411).send({
            message:"you're not signed up yet"
        })
        return 
    }
    const token = json.sign({
        userid: userexist._id,
    }, SECRET);
    res.json({
        token:token
    })


});

app.post("/organization",authMiddleware, async (req, res)=>{
    const userId = req.body;
    const newOrg = await organizationModel.create({
        title:req.body.title,
        description:req.body.descriptioin,
        admin:userId,
        members:[]
    })
    res.json({
        message: "Org created",
        
    })
});

app.post("/add-member-to-organization" , authMiddleware , async (req, res)=>{
    const userId = req.userId;
    // const hey = req.body.hey  // just to  check the argument pass
    // console.log(hey)
    const organizationId= req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const newad = await userModel.findOne({
        _id:userId
    }); 
    console.log(newad)
// console.log(organizationId +"\n"+ memberUsername + "\n"+ userId)

    let OrgExist  = await organizationModel.findOne({
        _id:organizationId
    });

    // console.log(userId + "\n" + OrgExist._id)
    if(!OrgExist || OrgExist.admin.toString() !== userId){
        res.status(411).send({
            message:"Either organization is not created yet or you're not an admin"
        });
        return
    }
    
    const memberExist = await userModel.findOne({
        username:memberUsername
    })
    if(!memberExist){
        res.status(411).json({
            message:"no user with this name exists in our db"
        });
        return
    }


    console.log(memberExist.username)


    OrgExist.members.push(memberExist._id);
    await OrgExist.save();
    res.json({
        message:"New Member added"
    });
});
app.post("/board", (req, res)=>{});
app.post("/issue" , (req, res)=>{});

// -----get endpoint
app.get("/organization",authMiddleware , async (req,res)=>{
    const userId=req.userId;
    // console.log(userId)
    const organizationId =req.query.organizationId;
    // console.log(organizationId)
    const OrgExist = await organizationModel.findOne({
        _id:organizationId
    });
// console.log(OrgExist);

    if(!OrgExist || OrgExist.admin.toString() !== userId){
        res.status(411).send({
            message:"Either organization is not created yet or you're not an admin"
        });
        return
    }
    const members = await userModel.find({
        _id:OrgExist.members
    })
    // console.log(members + "sdfjhnwei")
    res.json({
        Organization:{
            title:OrgExist.title,
            description:OrgExist.description,
            members:members.map(m => ({
                username:m.username,
                id:m._id
            }))

        }

});

})
app.get("/members", (req,res)=>[]);
app.get("/issues", (req,res)=>[]);
app.get("/boards", (req,res)=>[]);


// ---- UPDATE ENDPOINT 
app.put("/issues", (req,res)=>{});

// ----- DELETE ENDPOINT
app.delete("/members",authMiddleware, async (req, res)=>{
    const userId = req.userId;
    console.log(userId ," userId")
    const memberUsername = req.body.memberUserUsername;
    const organizationId = req.body.organizationId;

    const OgrExists = await organizationModel.findOne({
        _id:organizationId
    })
    if(!OgrExists || OgrExists.admin.toString() !== userId){
        res.status(412).json({
            message:"No Ogr Exists with this ID"
        })
    }
    const memberUser = await userModel.findOne({
        username:memberUsername
    })
    if(!memberUser){
        res.status(412).json({
            message: " No user with this username exists in our "
        })
        return
    };
    console.log(OgrExists)
console.log(OgrExists.members)
     OgrExists.members = OgrExists.members.filter(x=> x.toString() !== memberUser._id.toString());
     await OgrExists.save();
    
    res.json({
        message:"member deleted"
    })

});


app.listen(3001)