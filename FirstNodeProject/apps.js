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
apps.post('/upload', (req,res) => {
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
    const id = Math.floor(Math.random() * 10000);
    console.log(id);
    const newTask = {
        name,
        desrciption, 
        id
    };

    todoList.push(newTask);
    
    res.status(200).send({
        status : true,
        message : "Task Created Succesfully",
    });
});

//API for getting the tasks
apps.get('/task',(req,res) => {

    res.status(200).send({
        status : true,
        message : "Task Fetched Succesfully",
        data : todoList
    });
})


//API for getting all the task by id
apps.get('/task/:id',(req,res) => {

    console.log(req.params);
    const { id } = req.params;
    //const result = todoList.find(obj => obj.id == id);
    var result = {};
    for(var i=0; i<todoList.length; i++){
        if(id == todoList[i].id){
            result = todoList[i];
        }
    }

    res.status(200).send({
        status : true,
        message : "Task Fetched Succesfully",
        data : result
    });
})

//API to update the particular to task

apps.put('/task/:id', (req,res) => {
    const { id } = req.params;
    const { body } = req;
    
    for(var i=0; i<todoList.length; i++){
        if(todoList[i] == id){
            todoList[i] = {...todoList[i], ...body};
            break;
        }
    }
    res.status(200).send({
        status : true,
        message : "Task updated Succesfully",
        data : todoList[i]
    });
});




apps.listen(port, () =>{
    console.log(`Server Started at port ${port}`);
})
