var bcrypt = require("bcryptjs");
const db = require("../models");
const Role = db.role;
const User = db.user;

module.exports = function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "admin"
    });
  
    User.create({
      username: "admin",
      email: "admin@admin.com",
      password:"Azert0"
    }).then(user => {
      user.setRoles([1,2]).then(() => {
          console.log("Admin registered successfully!");
      });
    }).catch(err => {
      console.log(err.message);
    });
    User.create({
      username: "zouz",
      email: "zouz@zouz.com",
      password: "1234aA"
    }).then(user => {
      user.setRoles(1).then(() => {
          console.log("User registered successfully!");
      });
    }).catch(err => {
      console.log(err.message);
    });
}