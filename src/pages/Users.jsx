import React, { useEffect, useState } from "react";
import styles from "./Book.module.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "@material-ui/core";
import userService from "../service/user-service";
import { useNavigate } from "react-router-dom";
import { Typography, TextField } from "@material-ui/core";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Shared from "../utils/shared";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../context/auth";
import { toast } from "react-toastify";
toast.configure();

const Users = () => {
  const authContext = useAuthContext();
  const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  };
  const [filters, setFilters] = useState(defaultFilter);
  const [userList, setuserList] = useState({
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
      gatAllUsers({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const columns = [
    { id: "firstName", label: "First Name", minWidth: 100 },
    { id: "lastName", label: "Last Name", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 170 },
    {
      id: "roleName",
      label: "Role",
      minWidth: 130,
    },
  ];
  const gatAllUsers = (filters) => {
    userService.getAllUsers(filters).then((res) => {
      setuserList(res);
    });
  };

  const onConfirmDelete =async () => {
   await userService
     .deleteUser(selectedId)
     .then((res) => {
       if (res) {
         toast.success(Shared.messages.DELETE_SUCCESS);
         setOpen(false);
         setFilters({ ...filters });
       }
     })
     .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  return (
    <div className={styles.productContainer}>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Users
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
              {userList.items.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.firstName}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.lastName}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.email}
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    {row.role}
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
                        navigate(`/edit-user/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    {row.id !== authContext.user.id && (
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!userList.items.length && (
                <TableRow className={styles.tableRow}>
                  <TableCell colSpan={5} className={styles.tableCell}>
                    <Typography align="center" className={styles.noData}>
                      No Users
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
          count={userList.totalItems}
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
          title="Delete user"
          description="Are you sure you want to delete this user?"
        />
      </div>
    </div>
  );
};

export default Users;
