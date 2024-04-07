/**************************************************************
 * WEB700 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
 * assignment has been copied manually or electronically from any other source (including websites) or
 * distributed to other students.
 *
 * Name:Andrew Gonzales Student ID: 160562229 Date: 04/05/2024
 *
 * Online (Cyclic) Link: _________________________________
 **************************************************************/


const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/about", (req,res) => {
    res.render("about");
});

app.get("/htmlDemo", (req,res) => {
    res.render("htmlDemo");
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            (data.length > 0) ? res.render("students", { students: data }) : res.render("students", {message: "no results"});
        }).catch((err) => {
            res.render("students", {message: "no results"});
        });
    } else {
        data.getAllStudents().then((data) => {
            (data.length > 0) ? res.render("students", { students: data }) : res.render("students", {message: "no results"});
        }).catch((err) => {
            res.render("students", {message: "no results"});
        });
    }
});

app.get("/students/add", (req, res) => {
    data.getCourses()
        .then((courses) => {
            res.render("addStudent", { courses: courses });
        })
        .catch((err) => {
            res.render("addStudent", { courses: [] });
        });
});

app.post("/students/add", (req, res) => {
    data.addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error adding student");
        });
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.id).then((data) => {
        (data) ? res.render("student", { course: data }) : res.status(404).send("Student Not Found");
    }).catch((err) => {
        res.render("student", { message: "No results" });
    });
});

app.post("/student/update", (req, res) => {
    data.updateStudent(req.body).then(() => {
        res.redirect("/students");
    });
});

app.get("/student/delete/:studentNum", (req, res)=>{
    data.deleteStudentByNum(req.params.studentNum).then(()=>{
        res.redirect("/students");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Student / Student Not Found");
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((data) => {
        (data.length > 0) ? res.render("courses", {courses: data}) : res.render("courses", {message: "no results"});
    }).catch(err=>{
        res.render("courses", {message: "no results"});
    });
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.post("/courses/update", (req, res) => {
    data.updateCourse(req.body).then(() => {
        res.redirect("/courses");
    });
});

app.post("/courses/add", (req, res) => {
    data.addCourse(req.body).then(()=>{
        res.redirect("/courses");
    });
});

app.get("/course/:id", (req, res) => {
    data.getCourseById(req.params.id).then((data) => {
        (data) ? res.render("course", { course: data }) : res.status(404).send("Course Not Found");
    }).catch((err) => {
        res.render("course", { message: "No results" });
    });
});

app.get("/course/delete/:id", (req, res)=>{
    data.deleteCourseById(req.params.id).then(()=>{
        res.redirect("/courses");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Course / Course Not Found");
    });
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});

data.initialize().then(function() {
    app.listen(HTTP_PORT, function() {
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});
