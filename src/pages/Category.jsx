import React, { useEffect, useState } from "react";
import styles from "./Book.module.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button, Typography, TextField } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import categoryService from "../service/category-service";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Shared from "../utils/shared";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
toast.configure();

const Category = () => {
  const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  };
  const [filters, setFilters] = useState(defaultFilter);
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();

  const RecordsPerPage = [2, 5, 10, 100];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const columns = [{ id: "name", label: "Category Name", minWidth: 100 }];
  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
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
          Category
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
            onClick={() => navigate("/add-category")}
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
              {categoryRecords.items.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.name}
                  </TableCell>

                  <TableCell
                    style={{
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      textAlign: "right",
                      padding: 0,
                    }}
                  >
                    <Button
                      type="button"
                      style={{ marginRight: "1rem" }}
                      className={`${styles.btn} ${styles.green}`}
                      variant="contained"
                      color="green"
                      disableElevation
                      onClick={() => {
                        navigate(`/edit-category/${row.id}`);
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
              {!categoryRecords.items.length && (
                <TableRow className={styles.tableRow}>
                  <TableCell colSpan={6} className={styles.tableCell}>
                    <Typography align="center" className={styles.noData}>
                      No Category
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
          count={categoryRecords.totalItems || 0}
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
          title="Delete Category"
          description="Are you sure you want to delete this category?"
        />
      </div>
    </div>
  );
};

export default Category;
