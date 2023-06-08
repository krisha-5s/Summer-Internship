import React, { useEffect, useState } from "react";
import styles from "./BookListing.module.css";
import Pagination from "@material-ui/lab/Pagination";
import {
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import bookService from "../service/book-service";
import Shared from "../utils/shared";
import { useAuthContext } from "../context/auth";
import { useCartContext } from "../context/cart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [booksRes, setBooksRes] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [sortBy, setSortBy] = useState("");
  const [filter, setFilter] = useState({
    pageSize: 10,
    pageIndex: 1,
    keyword: "",
  });
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  useEffect(() => {
    if (filter.keyword === "") delete filter.keyword;
    getAllBook({ ...filter });
  }, [filter]);

  const getAllBook = (filter) => {
    bookService.allBooks(filter).then((res) => {
      console.log(res);
      setBooksRes(res);
      setBooks(res.items);
    });
  };
  useEffect(() => {}, [sortBy]);

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...books];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBooks(bookList);
  };

  const addToCart = (book) => {
    Shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.heading}>
        Book Listing
      </Typography>
      <div className={styles.bookListsContainer}>
        <div className={styles.bookHeader}>
          <div className={styles.totalBooks}>
            <p className={styles.totalText}>
              Total
              <span> - {booksRes.totalItems} items</span>
            </p>
          </div>
          <div className={styles.rightSearch}>
            <div className={styles.searchBox}>
              <TextField
                id="text"
                className={styles.search}
                name="text"
                placeholder="Search..."
                variant="outlined"
                inputProps={{ className: "small" }}
                size="small"
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    keyword: e.target.value,
                    pageIndex: 1,
                  });
                }}
              />
            </div>
            <div className={styles.sortingContainer} variant="outlined">
              <span htmlFor="select">Sort By</span>
              <Select
                className={styles.customSelect}
                value={sortBy}
                onChange={sortBooks}
              >
                <MenuItem value="a-z">a - z</MenuItem>
                <MenuItem value="z-a">z - a</MenuItem>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.booksContainer}>
        {books.map((book) => (
          <div className={styles.card}>
            <img
              src={book.base64image}
              alt="card img"
              className={styles.cardImg}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>
                {book.name.slice(0, 14) + (book.name.length > 14 ? "..." : "")}
              </h3>
              <p className={styles.category}>{book.category}</p>
              <p className={styles.desc}>
                {book.description.slice(0, 25) +
                  (book.description.length > 25 ? "..." : "")}
              </p>
              <p className={styles.price}>
                MRP &#8377; <span>{book.price}</span>
              </p>
              <Button
                onClick={()=>{addToCart(book)}}
                className={styles.btn}
                type="submit"
                color="secondary"
                variant="contained"
              >
                Add to cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.paginationContainer}>
        <Pagination
          count={booksRes.totalPages}
          page={filter.pageIndex}
          onChange={(e, newPage) => {
            setFilter({ ...filter, pageIndex: newPage });
          }}
        />
      </div>
    </div>
  );
};

export default BookListing;
