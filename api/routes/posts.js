const express = require('express');
const postModel = require('../models/post');
const commentModel = require('../models/comment');


const router = express.Router();


router.get('/:id', (req, res) => {
    postModel.getPostById(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(err.code).send(err));
});

router.get('/', (req, res) => {
    postModel.getPostByUserId(req.query.userId)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(err.code).send(err));
});

router.post('/', (req, res) => {
    postModel.insert(req.body)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(err.code).send(err));
});

router.post('/:id/comments', (req, res) => {
    commentModel.insert(req.params.id, req.body)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(err.code).send(err));
});

module.exports = router;