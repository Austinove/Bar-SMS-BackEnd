//item amount
const itemAmount = (id, quantity) => {
    Item.findById(id).then(item => {
        // salesQuantity = item.quantity + quantity;
        console.log(item);
        return item;
    }).catch(err => {
        throw err;
    });
}

module.exports = {itemAmount};