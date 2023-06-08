import React from "react";
import styles from "./Register.module.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import authService from "../service/auth-service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
toast.configure();

const roles = [
  {
    value: 3,
    label: "Buyer",
  },
  {
    value: 2,
    label: "Seller",
  },
];

// const form = (props) => {
//   const {

//     values,
//     touched,
//     errors,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//   } = props;

//   return (
//     <div>
//       <div className={styles.registerHeader}>
//         <Breadcrumbs
//           separator="›"
//           aria-label="breadcrumb"
//           className="breadcrumb-wrapper"
//         >
//           <Link color="inherit" to="/login" title="Home">
//             Home
//           </Link>
//           <Typography color="textPrimary">Create an Account</Typography>
//         </Breadcrumbs>
//       </div>
//       <Typography variant="h3" className={styles.header}>
//         Login or Create an Account
//       </Typography>

//       <form onSubmit={handleSubmit} className={styles.container}>
//         <div className={styles.personalInfo}>
//           <Typography variant="h7" className={styles.headerPersonal}>
//             Personal Information
//           </Typography>
//           <hr />
//           <p className={styles.subHeader}>
//             Please enter the following information to create your account.
//           </p>
//         </div>
//         <CardContent className={styles.mainForm}>
//           <TextField
//             id="firstName"
//             label="First Name"
//             value={values.firstName}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             helperText={touched.firstName ? errors.firstName : ""}
//             error={touched.firstName && Boolean(errors.firstName)}
//             margin="dense"
//             variant="outlined"
//             fullWidth
//           />
//           <TextField
//             id="lastName"
//             label="Last Name"
//             value={values.lastName}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             helperText={touched.lastName ? errors.lastName : ""}
//             error={touched.lastName && Boolean(errors.lastName)}
//             margin="dense"
//             variant="outlined"
//             fullWidth
//           />
//           <TextField
//             id="email"
//             label="Email"
//             type="email"
//             value={values.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             helperText={touched.email ? errors.email : ""}
//             error={touched.email && Boolean(errors.email)}
//             margin="dense"
//             variant="outlined"
//             fullWidth
//           />
//           <TextField
//             select
//             id="roleId"
//             label="Role"
//             value={values.roleId}
//             onChange={handleChange("roleId")}
//             helperText={touched.roleId ? errors.roleId : ""}
//             error={touched.roleId && Boolean(errors.roleId)}
//             margin="dense"
//             variant="outlined"
//             fullWidth
//           >
//             {roles.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//         </CardContent>
//         <div className={styles.loginInfo}>
//           <Typography variant="h7" className={styles.headerPersonal}>
//             Login Information
//           </Typography>
//           <hr />
//           <CardContent className={styles.mainForm}>
//             <TextField
//               id="password"
//               label="Password"
//               type="password"
//               value={values.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               helperText={touched.password ? errors.password : ""}
//               error={touched.password && Boolean(errors.password)}
//               margin="dense"
//               variant="outlined"
//               fullWidth
//             />
//             <TextField
//               id="confirmPassword"
//               label="Confirm Password"
//               type="password"
//               value={values.confirmPassword}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               helperText={touched.confirmPassword ? errors.confirmPassword : ""}
//               error={touched.confirmPassword && Boolean(errors.confirmPassword)}
//               margin="dense"
//               variant="outlined"
//               fullWidth
//             />
//           </CardContent>
//           <CardActions>
//             <Button
//               type="submit"
//               color="secondary"
//               variant="contained"
//               className={styles.actions}
//               style={{borderRadius:2}}
//             >
//               Register
//             </Button>
//           </CardActions>
//         </div>
//       </form>
//     </div>
//   );
// };

// const Form = withFormik({
//   mapPropsToValues: ({
//     firstName,
//     lastName,
//     email,
//     roleId,
//     password,
//     confirmPassword,
//   }) => {
//     return {
//       firstName: firstName || "",
//       lastName: lastName || "",
//       email: email || "",
//       roleId: roleId || "",
//       password: password || "",
//       confirmPassword: confirmPassword || "",
//     };
//   },

//   validationSchema: Yup.object().shape({
//     firstName: Yup.string().required("Required"),
//     lastName: Yup.string().required("Required"),
//     email: Yup.string()
//       .email("Enter a valid email")
//       .required("Email is required"),
//     roleId: Yup.number().required("Select your role"),
//     password: Yup.string()
//       .min(6, "Password must contain at least 6 characters")
//       .required("Enter your password"),
//     confirmPassword: Yup.string()
//       .required("Confirm your password")
//       .oneOf([Yup.ref("password")], "Password does not match"),
//   }),

//   handleSubmit: (data) => {
//     delete data.confirmPassword;
//     console.log(data);
//     authService.create(data).then((res) => {
//       console.log(res);
//       toast.success("Account created successfully!");
//     });
//   },
// })(form);

// export default (Form);

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    roleId: 0,
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    roleId: Yup.number().required("Select your role"),
    password: Yup.string()
      .min(6, "Password must contain at least 6 characters")
      .required("Enter your password"),
    confirmPassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Password does not match"),
  });

  const onSubmit = (data) => {
    delete data.confirmPassword;
    console.log(data);
    authService.create(data).then((res) => {
      console.log(res);
      if (!res.id) return;
      toast.success("Account created successfully!");
      navigate("/login");
    });
  };

  return (
    <div>
      <div className={styles.registerHeader}>
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          className="breadcrumb-wrapper"
        >
          <Link color="inherit" to="/login" title="Home">
            Home
          </Link>
          <Typography color="textPrimary">Create an Account</Typography>
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
            <div className={styles.personalInfo}>
              <Typography variant="h7" className={styles.headerPersonal}>
                Personal Information
              </Typography>
              <hr />
              <p className={styles.subHeader}>
                Please enter the following information to create your account.
              </p>
            </div>
            <CardContent className={styles.mainForm}>
              <TextField
                id="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.firstName ? errors.firstName : ""}
                error={touched.firstName && Boolean(errors.firstName)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                id="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.lastName ? errors.lastName : ""}
                error={touched.lastName && Boolean(errors.lastName)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
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
              />
              <TextField
                select
                id="roleId"
                label="Role"
                value={values.roleId}
                onChange={handleChange("roleId")}
                helperText={touched.roleId ? errors.roleId : ""}
                error={touched.roleId && Boolean(errors.roleId)}
                margin="dense"
                variant="outlined"
                fullWidth
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
            <div className={styles.loginInfo}>
              <Typography variant="h7" className={styles.headerPersonal}>
                Login Information
              </Typography>
              <hr />
              <CardContent className={styles.mainForm}>
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
                <TextField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    touched.confirmPassword ? errors.confirmPassword : ""
                  }
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              </CardContent>
              <CardActions>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  className={styles.actions}
                  style={{ borderRadius: 2 }}
                >
                  Register
                </Button>
              </CardActions>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
