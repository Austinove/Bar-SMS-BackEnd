const express = require("express");
const Sales = require("../../models/sales");
const auth = require("../auth/middleware");
const Item = require("../../models/Item");
const Counter = require("../../models/counter");
var _ = require("lodash");
const { itemAmount } = require("../operations/index");

const router = express.Router();

//read sales
router.get("/", auth, (req, res) => {
  Sales.find()
    .then((items) => {
      return res.status(200).send(items);
    })
    .catch((error) => {
      throw error;
    });
});

//make sale
router.post("/make", auth, (req, res) => {
  const { item, made_date, quantity } = req.body;

  if (!item || !made_date || !quantity) {
    return res.status(400).json({
      msg: "All fields are required",
    });
  }
  Counter.findOne({ item_id: item }, (err, result) => {
    if (err) {
      throw err;
    }
    if (result != null && result.quantity > 0) {
      if (result.quantity >= quantity) {
        Sales.findOne({ item, made_date }, (err, sale) => {
          
          if(err){ throw err }

            if (sale) {
              Item.findById(item)
                .then((item_value) => {
                  
                  if (item_value != null) {
                    var salesQuantity = sale.quantity + quantity;
                    var amount = salesQuantity * item_value.price;
                    console.log("=>", amount);
                    console.log("newQuantity", salesQuantity);
                    var counterQuantity = result.quantity - quantity;
                    Counter.findOneAndUpdate(
                      { item_id: item },
                      { quantity: counterQuantity },
                      (err, done) => {
                        if (err) {
                          throw err;
                        }
                      }
                    );
                    Sales.updateOne(
                      { item: item, made_date: made_date },
                      { quantity: salesQuantity, amount: amount },
                      { upsert: true },
                      (err, item) => {
                        if (err) {
                          res.status(404).send(err);
                        }
                        if (!item) {
                          res.status(404).send({
                            response: "Item no found",
                            message: false,
                          });
                        }
                        res
                          .status(200)
                          .send({ msg: "Sale registered successfully" });
                      }
                    );
                  } else {
                    res.status(200).send({ msg: "Item absent in store" });
                  }
                })
                .catch((err) => {
                  throw err;
                });
            } else {
                var counterQuantity = result.quantity - quantity;
                Counter.findOneAndUpdate(
                  { item_id: item },
                  { quantity: counterQuantity },
                  (err, done) => {
                    if (err) {
                      throw err;
                    }
                  }
                );

              Item.findById(item)
                .then((Storeitem) => {
                  if (Storeitem.price) {
                    var amount = quantity * Storeitem.price;
                    console.log(sale);

                    const newSale = new Sales({
                      item,
                      quantity,
                      amount,
                      made_date,
                    });

                    newSale
                      .save()
                      .then((sale) => {
                        res.status(200).send({
                          msg: "Sale saved successfully",
                        });
                      })
                      .catch((err) => {
                        throw err;
                      });
                  } else {
                    res.status(200).send({ msg: "Item absent in store" });
                  }
                })
                .catch((err) => {
                  throw err;
                });
            }
          })
      } else {
        res.status(404).send({ msg: "Less items available" });
      }
    } else {
      res.status(404).send({ msg: "Item is Over in Counter" });
    }
  });
});

// read by date
router.post("/specific", auth, (req, res) => {
  const { made_date } = req.body;
  Sales.find({ made_date })
    .then((items) => {
      return res.status(200).send(items);
    })
    .catch((error) => {
      throw error;
    });
});

module.exports = router;
