const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const ownerModel = require("../models/owner-model");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        try {

            const validation = ownerModel.validateOwner(req.body)
            if (validation.error) {
                return res.status(400).send({ error: validation.error.details[0].message });
            }

            let owner = await ownerModel.find()

            if (owner.length > 0) {
                return res
                    .status(500)
                    .send("You don't have permission to create an owner.");
            }

            let { fullName, email, password } = req.body;

            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(500).send(err.message);
                    }
                    else {
                        let createdOwner = await ownerModel.create({
                            fullName,
                            email,
                            password: hash,
                        });

                        res.status(201).send("Owner created successfully.");
                    }
                })
            })

        } catch (err) {
            res.status(500).send(err.message);
        }
    })
}

router.get("/", (req, res) => {
    res.send("Hey, it's working.");
})

module.exports = router;