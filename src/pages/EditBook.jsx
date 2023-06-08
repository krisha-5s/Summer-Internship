import React, { useEffect, useState } from "react";
import styles from "./EditBook.module.css";
import * as Yup from "yup";
import {
  Typography,
  TextField,
  Button,
  Input,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import bookService from "../service/book-service";
import { Formik } from "formik";
import { toast } from "react-toastify";
import categoryService from "../service/category-service";
import Shared from "../utils/shared";

const EditBook = () => {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const initialValues = {
    name: "",
    price: "",
    categoryId: 0,
    description: "",
    base64image: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getBookById();
    categoryService.getAll().then((res) => {
      setCategories(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Book Name is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.number()
      .min(1, "Category is required")
      .required("Category is required"),
    price: Yup.number().required("Price is required"),
    base64image: Yup.string().required("Image is required"),
  });

  const getBookById = () => {
    bookService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
        price: res.price,
        categoryId: res.categoryId,
        description: res.description,
        base64image: res.base64image,
      });
    });
  };

  const onSubmit = (values) => {
    bookService
      .save(values)
      .then((res) => {
        toast.success(
          values.id
            ? Shared.messages.UPDATED_SUCCESS
            : "Record created successfully"
        );
        navigate("/book");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  const onSelectFile = (e, setFieldValue, setFieldError) => {
    const files = e.target.files;
    if (files.length) {
      const fileSelected = e.target.files[0];
      const fileNameArray = fileSelected.name.split(".");
      const extension = fileNameArray.pop();
      if (["png", "jpg", "jpeg"].includes(extension.toLowerCase())) {
        if (fileSelected.size > 50000) {
          toast.error("File size must be less then 50KB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = function() {
          setFieldValue("base64image", reader.result);
        };
        reader.onerror = function(error) {
          throw error;
        };
      } else {
        toast.error("only jpg,jpeg and png files are allowed");
      }
    } else {
      setFieldValue("base64image", "");
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          {id ? "Edit" : "Add"} Book
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
                    id="name"
                    name="name"
                    label="Book Name *"
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

                <div className={styles.formCol}>
                  <TextField
                    type={"number"}
                    className={styles.input}
                    id="price"
                    name="price"
                    label="Book Price (RS)*"
                    variant="outlined"
                    helperText={touched.price ? errors.price : ""}
                    error={touched.price && Boolean(errors.price)}
                    value={values.price}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    style={{ minWidth: "80%" }}
                  />
                </div>

                <div className={styles.formCol}>
                  <FormControl
                    name="category"
                    className={`${styles.dropdown} ${styles.input}`}
                    variant="outlined"
                    style={{ minWidth: "80%" }}
                    size="small"
                    helperText={touched.category ? errors.category : ""}
                    error={touched.category && Boolean(errors.category)}
                  >
                    <InputLabel htmlFor="Select">Category *</InputLabel>
                    <Select
                      name={"categoryId"}
                      id={"category"}
                      onChange={handleChange}
                      value={values.categoryId}
                    >
                      {categories.map((rl) => (
                        <MenuItem value={rl.id} key={"category" + rl.id}>
                          {rl.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className={styles.formCol}>
                  {!values.base64image && (
                    <>
                      {" "}
                      <label
                        htmlFor="contained-button-file"
                        className="file-upload-btn"
                      >
                        <Input
                          name="file"
                          id="contained-button-file"
                          type="file"
                          helperText={touched.file ? errors.file : ""}
                          error={touched.file && Boolean(errors.file)}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            onSelectFile(e, setFieldValue, setFieldError);
                          }}
                        />
                        <Button
                          variant="contained"
                          component="span"
                          className="btn pink-btn"
                        >
                          Upload
                        </Button>
                      </label>
                    </>
                  )}
                  {values.base64image && (
                    <div className={styles.filUpload}>
                      <em>
                        <img
                          src={values.base64image}
                          alt=""
                          className={styles.uploadImg}
                        />
                      </em>
                      image{" "}
                      <span
                        onClick={() => {
                          setFieldValue("base64image", "");
                        }}
                        className={styles.close}
                      >
                        x
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${styles.formCol} ${styles.description}`}>
                  <TextField
                    className={styles.input}
                    id="description"
                    name="description"
                    label="Description *"
                    variant="outlined"
                    value={values.description}
                    multiline
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={touched.description ? errors.description : ""}
                    error={touched.description && Boolean(errors.description)}
                    size="medium"
                    style={{ minWidth: "90%" }}
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
                    navigate("/book");
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

export default EditBook;
