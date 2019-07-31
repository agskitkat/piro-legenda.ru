function add_to_cart_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "add": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                        "quantity": good.quantity
                    }
                ]
            }
        }
    });
}


function view_product_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "detail": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                    }
                ]
            }
        }
    });
}

function remove_from_cart_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "remove": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                    }
                ]
            }
        }
    });
}



function remove_from_cart_YE(purchase, goods) {
    dataLayer.push({
        "ecommerce": {
            "purchase": {
                "actionField": {
                    "id" : purchases
                },
                "products": goods
            }
        }
    });
}