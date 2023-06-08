import React, { useEffect, useState } from "react";
import styles from "./EditBook.module.css";
import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import categoryService from "../service/category-service";
import Shared from "../utils/shared";


const EditCategory = () => {
  

  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

 

  useEffect(() => {
    if (id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

 const getCategoryById = () => {
   categoryService.getById(Number(id)).then((res) => {
     setInitialValueState({
       id: res.id,
       name: res.name,
     });
   });
 };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
  });

 

  const onSubmit = (values) => {
   categoryService
     .save(values)
     .then((res) => {
       toast.success(Shared.messages.UPDATED_SUCCESS);
       navigate("/category");
     })
     .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  return (
    <div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          {id ? "Edit" : "Add"} Category
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
                    id="name"
                    name="name"
                    label="Category name *"
                    variant="outlined"
                    helperText={touched.name ? errors.name : ""}
                    error={touched.name && Boolean(errors.name)}
                    value={values.name}
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
                    navigate("/category");
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

export default EditCategory;
