const db = require("../models");
const User = db.user;
const Article = db.article;

module.exports = (req, res, next) => {
    const userId = req.body.id;
    const elementId = req.params.id;

    const url = new URL(req.url, process.env.URL_SERVER);
    const path = url.pathname.split("/");
    
    const element = path[2];

    User.findByPk(userId).then(user => {
        if (user === null) {
            return res.status(404).send({message: "User not found!"});
        };
        user.hasRole(2).then(result => {
            if (result) {
                console.log("you are admin")
                next();
                return;
            } 

            switch (element) {
                case "article":
                    user.hasArticle(elementId).then(r => {
                        if (r) {
                            console.log("you are owner")
                            next();
                            return;
                        } else {
                            res.status(403).send({
                                message: "Require ownership or Admin Role!"
                            });
                        };
                    }).catch(()=> {
                        res.status(500).send({message: "Error checking relations user/article"});
                    });
                    break;
                case "comment":
                    user.hasComment(elementId).then(r => {
                        if (r) {
                            console.log("you are owner")
                            next();
                            return
                        } else {
                            res.status(403).send({
                                message: "Require ownership or Admin Role!"
                            });
                        };
                    }).catch(()=> {
                        res.status(500).send({message: "Error checking relations user/comment"});
                    });
                    break;
                case "user":
                    if (user.id === req.body.targetUserId) {
                        next();
                        return;
                    } else {
                        res.status(403).send({
                            message: "Require ownership or Admin Role!"
                        });
                    };
                    
                    break;
                default:
                    res.send({message: "something went wrong"})
                    break;
            };
        }).catch(()=> {
            res.status(500).send({message: "Error checking relations user/role"});
        });
    }).catch(err => {
        res.status(500).send({message: err.message ||"Error fetching user by Pk"})
    });
};