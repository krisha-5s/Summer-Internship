import React from "react";
import styles from "./Register.module.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs, List, ListItem } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import authService from "../service/auth-service";
import { makeStyles } from "@material-ui/core/styles";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth";


const useStyles = makeStyles({
  root: {
    //  marginTop:40,
    borderRadius: 2,
  },
});



const Login = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const classes = useStyles();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must contain at least 6 characters")
      .required("Enter your password"),
  });

  const onSubmit = (data) => {
    console.log(data);
    authService.login(data).then((res) => {
      if (!res.id) return;
      authContext.setUser(res);
      console.log(res);
      toast.success("Loggedin successfully!");
      navigate("/");
    });
  };
  return (
    <div>
      <div className={styles.registerHeader}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link color="inherit" to="/login" title="Home">
            Home
          </Link>
          <Typography color="textPrimary">Login</Typography>
        </Breadcrumbs>
      </div>
      <Typography variant="h3" className={styles.header}>
        Login or Create an Account
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className={styles.container}>
            <CardContent className={styles.mainForm}>
              <div className={styles.register}>
                <div className={`${styles.personalInfo} ${styles.leftContent}`}>
                  <Typography variant="h7" className={styles.headerPersonal}>
                    New customer
                  </Typography>
                  <hr />
                  <p className={styles.subHeader}>
                    Registration is free and easy.
                  </p>
                  <List
                    sx={{
                      padding: 0,
                      textAlign: "center",
                      listStyleType: "disc",
                      display: "list-item",
                    }}
                  >
                    <ListItem>Faster checkout</ListItem>
                    <ListItem>Save multiple shipping addresses</ListItem>
                    <ListItem>View and track orders and more</ListItem>
                  </List>
                </div>

                <Link to="/register" className="btnContainer">
                  <Button
                    className={classes.root}
                    type="submit"
                    color="secondary"
                    variant="contained"
                  >
                    Create An Account
                  </Button>
                </Link>
              </div>
              <div className={styles.login}>
                <div className={styles.personalInfo}>
                  <Typography variant="h7" className={styles.headerPersonal}>
                    Registered customers
                  </Typography>
                  <hr />
                  <p className={styles.subHeader}>
                    If you have an account with us, please log in.
                  </p>
                </div>
                <div className={styles.inputContainer}>
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    className={styles.loginInput}
                  />

                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className="btnContainer">
                  <Button
                    className={classes.root}
                    type="submit"
                    color="secondary"
                    variant="contained"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
