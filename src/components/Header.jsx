import React, { useMemo } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../images/logo.svg";
import Searchbar from "./Searchbar/Searchbar";
import { useAuthContext } from "../context/auth";
import shared from "../utils/shared";
import cartIcon from "../images//cart.png";
import { useCartContext } from "../context/cart";
// import { Button, List } from "@material-ui/core";

const Header = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const logOut = () => {
    authContext.signOut();
  };

  const items = useMemo(() => {
    return shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);
  return (
    <div className={styles.headerWrapper}>
      <AppBar
        position="static"
        className={styles.header}
        style={{ boxShadow: "none" }}
      >
        <div className={styles.headerContainer}>
          <img src={logo} alt="logo" className={styles.logo} />
          <div className={styles.mainNavRight}>
            <Toolbar className={styles.navRight} color="secondary">
              {!authContext.user.id ? (
                <>
                  <Link to="/register" className={styles.link}>
                    Register
                  </Link>
                  <Link to="/login" className={styles.link}>
                    Login
                  </Link>
                </>
              ) : (
                <></>
              )}

              {items.map((item, index) => (
                <Link to={item.route} title={item.name} className={styles.link}>
                  {item.name}
                </Link>
              ))}
              {authContext.user.id ? (
                <Link
                  to="/cart"
                  variant="outlined"
                  color="primary"
                  className={styles.cart}
                >
                  <img src={cartIcon} alt="cart.png" />
                  <span className={styles.cartNum}>{cartContext.cartData.length}</span>
                  Cart
                </Link>
              ) : (
                <></>
              )}
            </Toolbar>

            {authContext.user.id ? (
              <button
                onClick={logOut}
                variant="outlined"
                color="primary"
                className={styles.logoutBtn}
              >
                Log out
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </AppBar>
      {authContext.user.id ? <Searchbar /> : <></>}
    </div>
  );
};

export default Header;
