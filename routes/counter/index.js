const express = require("express");
const auth = require("../auth/middleware");
const Counter = require("../../models/counter");
const Item = require("../../models/Item");
const StoreAction = require("../../models/StoreActions");

const router = express.Router();

router.get("/", (req, res) => {
  Counter.find()
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      throw error;
    });
});

router.post("/create", (req, res) => {
  const { item_id, quantity, role } = req.body;
  // chek for admin user
  if (role !== "admin") {
    return res.status(401).json({ msg: "authetication denied!" });
  }
// simple validation
  if (!item_id || !quantity) {
    res.status(400).json({
      msg: "All fields are required",
    });
  }
  Counter.findOne({ item_id }, (err, result) => {
    if (err) {
      throw err;
    }
    // checking if item is in the store
    Item.findById(item_id, (err, item) => {
      if (err) {
        throw err;
      }
      if (item != null) {
        if (item.quantity >= quantity) {
            var newQuantity = item.quantity - quantity;
            Item.findByIdAndUpdate(
              item_id,
              { quantity: newQuantity },
              (err, result) => {
                if (err) {
                  throw err;
                }
              }
            );
        } else {
          res.status(404).send({ msg: "Store has less items" });
        }
      } else {
        res.status(404).send({ msg: "Items not found" });
      }
    });
    // Saving action description to store
    const newAction = new StoreAction({
      item_id,
      desc: "Added to Counter",
      quantity,
    });
    newAction
      .save()
      .then((store_action) => {
        console.log("Stored Action", store_action);
      })
      .catch((error) => {
        throw error;
      });
      // trying to add item quantity to the existing item
    if (result != null) {
      var counterQuantity = result.quantity + quantity;
      Counter.findOneAndUpdate(
        {item_id},
        { quantity: counterQuantity },
        { new: true },
        (err, item_update) => {
          if (err) {
            throw err;
          }
          res.status(200).send(item_update);
        }
      );
    } else {
      // Adding new item to counter if it doesn't exist
      const newCounterItem = new Counter({
        item_id,
        quantity,
      });

      newCounterItem
        .save()
        .then((item) => {
          res.status(200).send(item);
        })
        .catch((error) => {
          throw error;
        });
    }
  });
});

router.put("/remove/:id", auth, (req, res) => {
  const { quantity } = req.body;
  // simple validation
  if (!quantity) {
    res.status(400).json({
      msg: "Quantity of item to remove is required",
    });
  }
  // finding the item in the counter
  Counter.findOne({ item_id: req.params.id }, (err, counter_item) => {
    if (err) {
      throw err;
    }
    // Returning the item quantity to the store
    if (counter_item != null && counter_item.quantity >= quantity) {
      Item.findById({_id: req.params.id}, (err, item) => {
        if (err) {
          throw err;
        }
        if (item != null) {
          var newQuantity = item.quantity + quantity;
          Item.findByIdAndUpdate(
            { _id: req.params.id },
            { quantity: newQuantity },
            (err, result) => {
              if (err) {
                throw err;
              }
            }
          );
        } else {
          res.status(404).send({ msg: "Items not found" });
        }
      });
      // Saving action description in the Store
      const newAction = new StoreAction({
        item_id: req.params.id,
        desc: "Removed from Counter",
        quantity: quantity,
      });
      newAction
        .save()
        .then((store_action) => {
          console.log("Stored Action", store_action);
        })
        .catch((error) => {
          throw error;
        });
        // Removing the quantity from counter
      const itemQuantity = counter_item.quantity - quantity;
      Counter.findOneAndUpdate(
        { item_id: req.params.id },
        {quantity: itemQuantity},
        (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send({
          msg: "Successfully removed"
        });
      });

    }else{
      res.status(500).send({ msg: "Counter has less quantity"});
    }
  });
});

module.exports = router;

// db.items.aggregate([
//   {
//     $lookup:{
//       from:"counters",
//       localField: "_id",
//       foreignField: "item_id",
//       as: "item_details"
//     }
//   }
// ]);