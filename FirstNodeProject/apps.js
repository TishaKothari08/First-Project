const express = require('express');
const multer = require('multer');

const apps = express();
const port = 9000;

apps.use(express.json());
apps.use(express.urlencoded({extended : true}));

const storage = multer.diskStorage({
    destination : (req, file, callbackFunc) => {
       callbackFunc(null, 'uploaded/') 
    },
    filename : (req, file, callbackFunc) =>{
       //console.log(file);

       //1st approach
        const newFileName = Date.now() + '_' + file.originalname;

       //2nd approach
       //var newFileName = '';
    //    switch(file.mimetype){
    //        case "application/pdf":
    //            newFileName = Date.now() + '_' + '.pdf';
    //            break;
    //         case "image/jpeg" : {
    //             newFileName = Date.now() + '_ImageFiles' + '.jpeg';
    //             break;
    //         }   
    //    }

       callbackFunc(new Error('Some Occured') , newFileName)
    }
})

const upload = multer({ storage : storage}).any();

apps.use('/static',express.static('public'));

apps.post('/upload',upload, (req,res) => {
    upload(req, res, (err) => {

        if(err){
            return res.status(400).send({
                message : "Some error occured",
            })
        }
        console.log(err);

        try {
            const paths = [];
            req.files.forEach(val => {
                paths.push({path : val.path});
            })
            return res.send({paths});
        } 
        catch (error) {
            return res.status(400).send({
                message : "Some error occured",
            })
        }
    });
})

//TODO APIs

const todoList = [];

//API to create the new task

apps.post('/task',(req,res) => {

    const {name, desrciption } = req.body;

    const newTask = {
        name,
        desrciption, 
    };

    todoList.push(newTask);
    
    res.status(200).send({
        status : true,
        message : "Task Created Succesfully",
        todoList : todoList
    });
});



apps.listen(port, () =>{
    console.log(`Server Started at port ${port}`);
})
