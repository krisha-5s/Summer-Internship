import React, { useEffect, useState } from "react";
import { Typography, Button, Link } from "@material-ui/core";
import { useAuthContext } from "../context/auth";
import { toast } from "react-toastify";
import orderService from "../service/order-service";
import Shared from "../utils/shared";
import { useCartContext } from "../context/cart";
import { useNavigate } from "react-router-dom";
import cartService from "../service/cart-service";
import styles from "./Cart.module.css";

const Cart = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();

  const [CartList, setCartList] = useState([]);
  const [ItemsInCart, setItemsInCart] = useState(0);
  const [TotalPrice, setTotalPrice] = useState(0);

  const getTotalPrice = (ItemList) => {
    let totalPrice = 0;
    ItemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    setCartList(cartContext.cartData);
    setItemsInCart(cartContext.cartData.length);
    getTotalPrice(cartContext.cartData);
  }, [cartContext.cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Somthing went wrong!");
    }
  };
  const updateQuantity = async (cartItem, inc, e) => {
    const current_count = parseInt(
      e.target.closest(".qty-group").children[1].innerText
    );
    const quantity = inc ? current_count + 1 : current_count - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }
    cartService
      .updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      })
      .then((res) => {
        if (res) {
          const item = CartList.find(
            (item) => item.book.id === cartItem.book.id
          );
          if (item) {
            const current_div_count = parseInt(
              e.target.closest(".qty-group").children[1].innerText
            );
            const newCount = inc
              ? current_div_count + 1
              : current_div_count - 1;
            e.target.closest(".qty-group").children[1].innerText = newCount;
            const newPrice = inc
              ? TotalPrice + parseInt(item.book.price)
              : TotalPrice - parseInt(item.book.price);
            setTotalPrice(newPrice);
          }
        }
      });
  };

  const PlaceOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.length) {
        try {
          let cartIds = [];
          userCart.forEach((element) => {
            cartIds.push(element.id);
          });
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            navigate("/");
            toast.success(Shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Cart page
        </Typography>
        <div className={styles.header}>
          <div className={styles.bag}>
            My Shopping Bag ({ItemsInCart} Items)
          </div>
          <div className={styles.total}>Total price: {TotalPrice}</div>
        </div>
        <div className={styles.cartListContainer}>
          {CartList.map((cartItem) => {
            return (
              <div className={styles.item} key={cartItem.id}>
                <div className={styles.imgContainer}>
                  <Link>
                    <img
                      src={cartItem.book.base64image}
                      alt="dummy-pic"
                      className={styles.itemImg}
                    />
                  </Link>
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.topContent}>
                    <div className={styles.leftContent}>
                      <p className={styles.bookTitle}>{cartItem.book.name}</p>
                    </div>
                    <div className={styles.priceContainer}>
                      <span className={styles.bookPrice}>
                        MRP &#8377; {cartItem.book.price}
                      </span>
                    </div>
                  </div>
                  <div className={styles.bottomContent}>
                    <div className={`${styles.qty} qty-group`}>
                      <button
                        className={styles.qtyBtn}
                        onClick={(e) => updateQuantity(cartItem, true, e)}
                      >
                        +
                      </button>
                      <span className={styles.bookCount}>
                        {cartItem.quantity}
                      </span>
                      <button
                       
                        className={styles.qtyBtn}
                        onClick={(e) => updateQuantity(cartItem, false, e)}
                      >
                        -
                      </button>
                    </div>
                    <p onClick={() => removeItem(cartItem.id)} className={styles.removeLink}>Remove</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.btnContainer}>
          <Button
            className={styles.btn}
            onClick={PlaceOrder}
            color="secondary"
                      variant="contained"
                      style={{borderRadius:1}}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
