// routes/search_home.js
import { verifyAuth } from "../utils/authVerify.js";
import { database } from "../index.js";
import { ObjectId } from "bson";

export const authUser = (req, res) => {
  const { authToken, appleId, fullName, email } = req.query;

  database
    .findOne({ appleId: appleId })
    .then((user) => {
      if (user) {
        // check if email provided is different from stored. Ex: delete app resign in with new email but same appleId
        if (email && email !== user.email) {
          user.email = email;
        }

        return res.end(JSON.stringify(user));
      } else {
        verifyAuth(authToken, (err, payload) => {
          if (err) {
            console.log("[error] verifying auth: ", err.message);
            res.status(401).end();
          } else {
            if (appleId && fullName && email) {
              database
                .insertOne({
                  appleId: appleId,
                  fullName: fullName,
                  email: email,
                })
                .then((user) => {
                  return res.send(user);
                })
                .catch((error) => {
                  console.error("[error] creating user: ", error);
                  res.status(401).end();
                });
            } else {
              return res.status(401).send();
            }
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).end();
    });
};

export const updateUser = (req, res) => {
  const userData = req.body;

  database
    .findOneAndUpdate(
      { _id: new ObjectId(userData._id) },
      { $set: { ownedLocations: userData.ownedLocations } },
      { new: true }
    )
    .then((user) => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(401).end();
    });
};
