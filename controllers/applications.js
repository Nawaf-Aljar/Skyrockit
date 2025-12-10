// controllers/applications.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { route } = require('./auth');

// we will build out our router logic here


router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const {applications} = currentUser
    res.render('applications/index.ejs', {applications});
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

//create
router.get("/new", async (req,res) => {
    try{
        res.render("applications/new.ejs")
    }
    catch(err){
        console.log("Error", err)
        res.redirect("/")
    }
})
router.get("/:id", async (req,res) => {
    try{
    //find the user
    const currentUser = await User.findById(req.session.user._id)
    // find the specific app in the apps array of the user
    const application = currentUser.applications.id(req.params.id)
    res.render("applications/show.ejs", {application})
    }
    catch(err){
        console.error("Error", err)
        res.redirect("/")
    }
})
router.post("/", async (req,res) => {
    //first find the current user
    //Create the application payload
    // push the new application to user.applications
    try{
        const currentUser = await User.findById(req.session.user._id)
        currentUser.applications.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${req.session.user._id}/applications`)
    }
    catch(err){
        console.error(err)
        res.redirect("/")
    }
})
router.get('/:applicationId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application: application,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
router.put("/:id", async (req,res) => {
    try{
    const currentUser = await User.findById(req.session.user._id)
    const application = currentUser.applications.id(req.params.id)
    application.set(req.body)
    await currentUser.save()
    res.redirect(`/users/${currentUser._id}/applications/${application._id}`)
    }
    catch(err){
        console.error("Error", err)
        res.redirect("/")
    }
})
router.delete("/:id", async (req,res) => {
    try{
    const currentUser = await User.findById(req.session.user._id)
    currentUser.applications.id(req.params.id).deleteOne()
    await currentUser.save()
    res.redirect(`/users/${currentUser._id}/applications`)
    }
    catch(err){
        console.error("error", err)
        res.redirect("/")
    }
})


module.exports = router;
