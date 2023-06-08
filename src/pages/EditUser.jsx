import React, { useEffect, useState } from "react";
import styles from "./EditBook.module.css";
import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import userService from "../service/user-service";
import Shared from "../utils/shared";
import { useAuthContext } from "../context/auth";

const EditUser = () => {
  const authContext = useAuthContext();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();

  const navigate = useNavigate();
  const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (id) getUserById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user) {
      setInitialValueState({
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roleId: user.roleId,
        password: user.password,
      });
    }
  }, [user, roles]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    roleId: Yup.number().required("Role is required"),
  });

  const getUserById = () => {
    userService.getById(Number(id)).then((res) => {
      if (res) {
        setUser(res);
      }
    });
  };

  const getRoles = () => {
    userService.getAllRoles().then((res) => {
      if (res) {
        setRoles(res);
      }
    });
  };

  const onSubmit = (values) => {
    const updatedValue = {
      ...values,
      role: roles.find((r) => r.id === values.roleId).name,
    };
    userService
      .update(updatedValue)
      .then((res) => {
        if (res) {
          toast.success(Shared.messages.UPDATED_SUCCESS);
          navigate("/users");
        }
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  return (
    <div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Edit User
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
            setValues,
            setFieldError,
            setFieldValue,
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
                  <FormControl
                    name="role"
                    className={`${styles.dropdown} ${styles.input}`}
                    variant="outlined"
                    style={{ minWidth: "80%" }}
                    size="small"
                  >
                    <InputLabel htmlFor="select">Role </InputLabel>
                    <Select
                      name="roleId"
                      id={"roleId"}
                      onChange={handleChange}
                      value={values.roleId}
                      disabled={values.id === authContext.user.id}
                    >
                      {roles.length > 0 &&
                        roles.map((role) => (
                          <MenuItem value={role.id} key={"name" + role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
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
                    navigate("/users");
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

export default EditUser;
