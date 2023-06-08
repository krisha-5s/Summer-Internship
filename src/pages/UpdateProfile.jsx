import React, {  useState ,useEffect} from "react";
import styles from "./EditBook.module.css";
import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
  
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import userService from "../service/user-service";
import Shared from "../utils/shared";
import {  useAuthContext } from "../context/auth";

const UpdateProfile = () => {
  const authContext = useAuthContext();
    const { user } = authContext;

  const navigate = useNavigate();
  const initialValues = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    newPassword: "",
    confirmPassword: "",
  };
    useEffect(() => {
      if (user) {
        setInitialValueState({
          
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            newPassword: "",
            confirmPassword:""
        });
      }
    });
  const [initialValueState, setInitialValueState] = useState(initialValues);

const [updatePassword, setUpdatePassword] = useState(false);



   const validationSchema = Yup.object().shape({
     firstName: Yup.string().required("First Name is required"),
     lastName: Yup.string().required("Last Name is required"),
     email: Yup.string()
       .email("Invalid email address format")
       .required("Email is required"),
     newPassword: Yup.string().min(5, "Minimum 5 charactor is required"),
     confirmPassword: updatePassword
       ? Yup.string()
           .required("Must required")
           .oneOf([Yup.ref("newPassword")], "Passwords is not match")
       : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
   });


  const onSubmit =async (values) => {
   const password = values.newPassword ? values.newPassword : user.password;
    delete values.confirmPassword;
    delete values.newPassword;
      const data = Object.assign(user, { ...values, password });
      delete data._id;
      delete data.__v;
    const res = await userService.updateProfile(data);
    if (res) {
      authContext.setUser(res);
      toast.success(Shared.messages.UPDATED_SUCCESS);
      navigate("/");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Update Profile
        </Typography>
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
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
            <form onSubmit={handleSubmit}>
              <div className={styles.formContainer}>
                <div className={styles.formCol}>
                  <TextField
                    className={styles.input}
                    id="firstName"
                    name="firstName"
                    label="First Name *"
                    variant="outlined"
                    helperText={touched.firstName ? errors.firstName : ""}
                    error={touched.firstName && Boolean(errors.firstName)}
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>

                <div className={styles.formCol}>
                  <TextField
                    className={styles.input}
                    id="lastName"
                    name="lastName"
                    label="Last Name *"
                    variant="outlined"
                    helperText={touched.lastName ? errors.lastName : ""}
                    error={touched.lastName && Boolean(errors.lastName)}
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>
                <div className={styles.formCol}>
                  <TextField
                    className={styles.input}
                    id="email"
                    name="email"
                    label="Email *"
                    variant="outlined"
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>
                <div className={styles.formCol}>
                  <TextField
                    className={styles.input}
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    variant="outlined"
                    value={values.newPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>
                <div className={styles.formCol}>
                  <TextField
                    className={styles.input}
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>
              </div>
              <div className={styles.btnContainer}>
                <Button
                  className="green-btn btn"
                  variant="contained"
                  type="submit"
                  color="default"
                  disableElevation
                >
                  Save
                </Button>
                <Button
                  className="pink-btn btn"
                  variant="contained"
                  type="button"
                  color="secondary"
                  disableElevation
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfile;
