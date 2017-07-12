const express = require('express');
const postModel = require('../models/post');


const router = express.Router();


router.get('/:id', (req, res) => {
    postModel.getPostById(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

router.get('/', (req, res) => {
    postModel.getPostByUserId(req.query.userId)
        .then(result => res.status(200).send(result))
        .catch(err => {
            if (err === '404') res.sendStatus(404);
            else res.status(500).send(err);
        });
});

router.post('/', (req, res) => {
    postModel.insert(req.body)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(500).send(err));
});

module.exports = router;