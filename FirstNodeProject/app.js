const express = require('express');
const multer = require('multer');

const app = express();
const port = 9000;

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

const logger = (req, res, next) => {
    console.log('My Logger');
    req["owner"] = 'Tisha';
    req.body = {
        ...req.body,
        owner : "Tisha"
    }
    next();
}



app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(logger);

app.use('/static',express.static('public'));

app.get('/index.html',(req,res) => {
    res.sendFile(__dirname + '/public/html/index.html');
})

app.post('/upload',upload, (req,res) => {
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

app.get('/api/students',(req,res) => {
    console.log(req.body);
    res.send('Hello World!! get');
})

app.post('/api/students', (req,res) => {
    console.log(req.body, req.owner);
    res.send('Created Post request');
})

app.put('/api/students',(req,res) => {
    res.send('Hello World!! put');
})

app.delete('/api/students',(req,res) => {
    res.send('Hello World!! delete');
})

app.listen(port, () =>{
    console.log(`Server Started at port ${port}`);
})
