import React, { useEffect, useState } from "react";
import styles from './Book.module.css'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "@material-ui/core";
import bookService from "../service/book-service";
import { useNavigate } from "react-router-dom";
import { Typography, TextField } from "@material-ui/core";
import categoryService from "../service/category-service";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Shared from "../utils/shared";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
toast.configure();

const Book = () => {

     const defaultFilter = {
       pageIndex: 1,
       pageSize: 10,
       keyword: "",
     };
  const [filters, setFilters] = useState(defaultFilter);
  const [bookRecords, setBookRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();


 const RecordsPerPage = [2, 5, 10, 100];
  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);
  
  const columns = [
    { id: "name", label: "Book Name", minWidth: 100 },
    { id: "price", label: "Price", minWidth: 100 },
    { id: "category", label: "Category", minWidth: 100 },
  ];
  const searchAllBooks = (filters) => {
    bookService.allBooks(filters).then((res) => {
      setBookRecords(res);
    });
  };


  const onConfirmDelete = () => {
    bookService
      .deleteBook(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  return (
    <div className={styles.productContainer}>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Book Page
        </Typography>
        <div className={styles.btnContainer}>
          <TextField
            id="text"
            name="text"
            placeholder="Search..."
            variant="outlined"
            onChange={(e) => {
              setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
            }}
            size="small"
            className={styles.search}
          />
          <Button
            type="button"
            className={`${styles.btn} ${styles.pink}`}
            variant="contained"
            color="secondary"
            disableElevation
            onClick={() => navigate("/add-book")}
            style={{ padding: "8px 30px", borderRadius: "1px" }}
          >
            Add
          </Button>
        </div>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: "bold",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookRecords.items.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.price}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {categories.find((c) => c.id === row.categoryId).name}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)",textAlign:"right",padding:0 }}
                  >
                    <Button
                      type="button"
                      style={{marginRight:"1rem",}}
                      className={`${styles.btn} ${styles.green}`}
                      variant="contained"
                      color="green"
                      disableElevation
                      onClick={() => {
                        navigate(`/edit-book/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className={`${styles.btn} ${styles.pink}`}
                      variant="contained"
                      color="secondary"
                      disableElevation
                      onClick={() => {
                        setOpen(true);
                        setSelectedId(row.id || 0);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!bookRecords.items.length && (
                <TableRow className={styles.tableRow}>
                  <TableCell colSpan={5} className={styles.tableCell}>
                    <Typography align="center" className={styles.noData}>
                      No Books
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={bookRecords.totalItems}
          rowsPerPage={filters.pageSize || 10}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this book?"
        />
      </div>
    </div>
  );
};

export default Book;
