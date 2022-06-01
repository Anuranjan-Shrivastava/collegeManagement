const express = require('express') ;
const router = express.Router() ;
const passport = require('passport') ;
const notesController = require('../../controllers/v2/notesController') ; 


router.post('/upload' ,[passport.authenticate('jwt',{session : false}) , notesController.uploadNotes] ,  notesController.makeNotes) ;
router.get('/fetchNotes' ,passport.authenticate('jwt',{session : false})  ,  notesController.fetchNotes)


module.exports = router  ; 