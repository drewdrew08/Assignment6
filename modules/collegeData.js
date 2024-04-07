const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'Agonzales19', 'U7HqGW9YEPjF', {
    host: 'ep-dry-wildflower-a58d8uic.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    },
    query: { raw: true }
});

var Student = sequelize.define('Student', {
    studentNum: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course'});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to sync the database"); return;
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("No results returned"); return;
        });
    });
};

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        Course.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("Query returned 0 results"); return;
        });
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch((err) => {
            reject("No results returned"); return;
        });
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                course: course
            }
        }).then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("No results returned"); return;
        });
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (var prop in studentData) {
            if (studentData[prop] == '') 
            studentData[prop] = null;
        }
        Student.create(studentData).then(() => {
            resolve();
        }).catch((err) => {
            console.log(err);
            reject("Unable to create student"); return;
        });

    });
};

module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: {
                studentNum: studentNum
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("Unable to delete student"); return;
        });
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (var prop in studentData) {
            if (studentData[prop] == '') 
            studentData[prop] = null;
        }
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("Unable to update student"); return;
        });
    });
};

module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        
        for (var prop in courseData) {
            if (courseData[prop] == '') 
            courseData[prop] = null;
        }
        Course.create(courseData).then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to create course"); return;
        });
    });
};

module.exports.updateCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        for (var prop in courseData) {
            if (courseData[prop] == '')
            courseData[prop] = null;
        }

        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("Unable to update course"); return;
        });
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: {
                courseId: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("No results returned"); return;
        });
    });
};

module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: {
                courseId: id
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("Unable to delete course"); return;
        });
    });
};
