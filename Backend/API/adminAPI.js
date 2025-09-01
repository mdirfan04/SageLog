const exp=require('express');
const adminApp=exp.Router();
const expressasynchandler=require('express-async-handler');
const {Userauthor}=require('../models/userauthormodel');
const { Article } = require('../models/articeModel');
const {createuserorauthor} = require('./createuserorauthor');

adminApp.post('/admin',expressasynchandler(createuserorauthor));
// blocking email of email or author
adminApp.put('/block/:articleId',expressasynchandler(async (req,res)=>{
const articleId=req.params.articleId;
const dbRes=await Article.findOne({articleId:articleId});
const modifiedArticle = req.body;
modifiedArticle.isArticleActive = false;
const response= await Article.findOneAndUpdate(
  { articleId: articleId },
  { ...modifiedArticle },
  { returnDocument: "after" }
);

res.status(200).json({
  message:"article blocked"
})

}))

adminApp.put('/comments/block/:commentId', expressasynchandler(async (req, res) => {
  try {
      const commentId = req.params.commentId;

      const response = await Article.findOneAndUpdate(
          { "comments.commentId": commentId },
          { $set: { "comments.$.isCommentActive": false } },
          { new: true }
      );

      if (!response) {
          return res.status(404).json({ message: "Comment not found" });
      }

      res.status(200).json({ message: "Comment blocked successfully", updatedArticle: response });
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}));



module.exports={
  adminApp:adminApp
}