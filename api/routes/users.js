const express = require('express');
const userModel = require('../models/user');


const router = express.Router();


router.get('/:id', (req, res) => {
    userModel.getUserById(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
    userModel.insert(req.body)
        .then(result => res.status(201).send(result))
        .catch(err => {
            if (err === '409') res.status(409).send('User already exists');
            else res.status(500).send(err);
        });
});

module.exports = router;