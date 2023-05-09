import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./productDashboard.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import edit from "./images/icons8-create-64.png";
import Swal from "sweetalert2";

const CategoryDash = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMode1, setEditMode1] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [idCategory, setIdCategory] = useState(null);
  const [category, setCategory] = useState({
    title: "",
  });
  const [subcategory, setSubcategory] = useState({
    title: "",
    category: "",
  });
  const [idSubCategory, setIdSubCategory] = useState(null);
  const columns = [
    { id: "remove", label: " ", minWidth: 100 },
    { id: "images", label: "Subcategory", minWidth: 100 },
    { id: "product", label: "Category", minWidth: 100 },
    { id: "edit", label: "edit", minWidth: 100 },
  ];
  const column = [
    { id: "title", label: "Category", minWidth: 100 },
    { id: "edit", label: "edit", minWidth: 100 },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://zoneoutlet-ckb5.onrender.com/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          "https://zoneoutlet-ckb5.onrender.com/subcategories"
        );
        setSubcategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const getCategoryById = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `https://zoneoutlet-ckb5.onrender.com/categories/${id}`
      );
      setCategory(response.data);
      setIdCategory(id);
      setEditMode1(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getSubCategoryById = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `https://zoneoutlet-ckb5.onrender.com/subcategories/${id}`
      );
      setSubcategory(response.data);
      setIdSubCategory(id);
      setEditMode(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const form = useRef();

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setCategory({ ...category, [name]: value });
  };

  const handleEditSubmitCategory = async (event) => {
    console.log(idCategory);
    event.preventDefault();
    fetch(`https://zoneoutlet-ckb5.onrender.com/categories/${idCategory}`, {
      method: "PUT",
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded"
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: category.title,
      }),
    })
      .then((response) => response.json())
      .then(setEditMode1(false))
      .then(
        Swal.fire({
          title: "Category updated successfully!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-style",
            title: "custom-style",
            confirmButton: "custom-style",
          },
        })
      );

    // Fetch the updated list of products
    const response = await axios.get(
      `https://zoneoutlet-ckb5.onrender.com/categories`
    );

    // Update the state of the products with the new list

    setCategories(response.data).catch((error) => console.error(error));
  };

  const handleSubCategoryChange = (event) => {
    console.log(event.target.value);
    const { name, value } = event.target;
    setSubcategory({ ...subcategory, [name]: value });
    console.log("rrrr", subcategory);
  };

  const handleEditSubmitSubCategory = async (event) => {
    event.preventDefault();
    fetch(
      `https://zoneoutlet-ckb5.onrender.com/subcategories/${idSubCategory}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: subcategory.title,
          category: subcategory.category,
        }),
      }
    )
      .then((response) => response.json())
      .then(setEditMode(false))
      .then(
        Swal.fire({
          title: "Subcategory updated successfully!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-style",
            title: "custom-style",
            confirmButton: "custom-style",
          },
        })
      );
    {
      // Fetch the updated list of products
      const response = await axios.get(
        `https://zoneoutlet-ckb5.onrender.com/subcategories`
      );
      // Update the state of the products with the new list
      setSubcategories(response.data).catch((error) => console.error(error));
    }
  };

  const handleRemove = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-style",
        title: "custom-style",
        confirmButton: "custom-style",
        cancelButton: "custom-style",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://zoneoutlet-ckb5.onrender.com/subcategories/${id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            const data = response.json();
            setSubcategory(data);
          } else {
            console.error("Failed to remove subcategory");
          }
        } catch (error) {
          console.error(error);
        }
        // Fetch the updated list of products
        const response = await axios.get(
          `https://zoneoutlet-ckb5.onrender.com/subcategories`
        );

        // Update the state of the products with the new list

        setSubcategories(response.data);
      }
    });
  };

  const handleAddSubcategory = () => {
    setAddMode(true);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    await fetch("https://zoneoutlet-ckb5.onrender.com/subcategories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: subcategory.title,
        category: subcategory.category,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSubcategory(data);
        setAddMode(false);
        Swal.fire({
          title: "Subcategory added successfully!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-style",
            title: "custom-style",
            confirmButton: "custom-style",
          },
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Fetch the updated list of products
    const response = await axios.get(
      "https://zoneoutlet-ckb5.onrender.com/subcategories"
    );

    // Update the state of the products with the new list

    setSubcategories(response.data);
  };

  return (
    <>
      <div className="sub-cat-dash">
        <div className="catdash-section">
          <h1 className="cart-title-catdash">Category Dashboard</h1>
          <div className="cart-table-prodash">
            <Paper
              sx={{
                width: "75%",

                overflow: "hidden",
                marginLeft: "auto",
                marginRight: "auto",
                border: "#0B486A solid 1px",
              }}
            >
              <TableContainer sx={{ maxHeight: "600px" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {column.map((colum) => (
                        <TableCell
                          key={colum.id}
                          align={colum.align}
                          style={{ minWidth: colum.minWidth }}
                        >
                          {colum.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category, i) => (
                      <TableRow key={i}>
                        <TableCell>{category.title}</TableCell>
                        <TableCell>
                          <button
                            className="prodash-button"
                            onClick={() => getCategoryById(category._id)}
                          >
                            <img className="prodash-icon" src={edit} alt="#" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          {editMode1 && (
            <div className="subcat-form-container">
              <h1>Update Category Name</h1>
              <form
                className="cat-edit-form"
                onSubmit={handleEditSubmitCategory}
                ref={form}
              >
                <div className="username">
                  <label className="About_username">Category name:</label>{" "}
                  <br />
                  <input
                    className="subcat-edit-input"
                    type="text"
                    id="username"
                    placeholder="Category name"
                    name="title"
                    value={category.title}
                    onChange={handleCategoryChange}
                  />
                </div>
                <button className="subcat-edit-button" type="submit">
                  Update Subcategory
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="subdash-section">
          <h1 className="cart-title-catdash">Subcategory Dashboard</h1>
          <div className="cart-table-prodash">
            <p>At least 3 subcategories in each category</p>
            <button
              className="button-addsubcategory"
              onClick={handleAddSubcategory}
            >
              Add Subcategory
            </button>
            <Paper
              sx={{
                width: "75%",
                overflow: "hidden",
                marginLeft: "auto",
                marginRight: "auto",
                border: "#0B486A solid 1px",
              }}
            >
              <TableContainer sx={{ maxHeight: "600px" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subcategories.map((product, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <button
                            className="cart-button-icon"
                            onClick={() => handleRemove(product._id)}
                          >
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="cart-Xicon"
                            />
                          </button>
                        </TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.category.title}</TableCell>
                        <TableCell>
                          <button
                            className="prodash-button"
                            onClick={() => getSubCategoryById(product._id)}
                          >
                            <img className="prodash-icon" src={edit} alt="#" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </div>
      <div className="forms-section">
        {addMode && (
          <div className="subcat-form-container">
            <h1>Add Subcategory</h1>
            <form
              className="subcat-edit-form"
              onSubmit={handleAddSubmit}
              ref={form}
            >
              <div className="username">
                <label className="About_username">Subcategory name:</label>{" "}
                <br />
                <input
                  className="subcat-edit-input"
                  type="text"
                  id="username"
                  placeholder="subcategory name"
                  name="title"
                  value={subcategory.title}
                  onChange={handleSubCategoryChange}
                />
              </div>
              <div className="username">
                <label className="About_username">Category:</label> <br />
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleSubCategoryChange}
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <button className="subcat-edit-button" type="submit">
                Add Subcategory
              </button>
            </form>
          </div>
        )}
        {editMode && (
          <div className="subcat-form-container">
            <h1>Update Subcategory</h1>
            <form
              className="subcat-edit-form"
              onSubmit={handleEditSubmitSubCategory}
              ref={form}
            >
              <div className="username">
                <label className="About_username">Subcategory name:</label>{" "}
                <br />
                <input
                  className="subcat-edit-input"
                  type="text"
                  id="username"
                  placeholder="Subcategory name"
                  name="title"
                  value={subcategory.title}
                  onChange={handleSubCategoryChange}
                />
              </div>
              <div className="username">
                <label className="About_username">Category:</label> <br />
                <select
                  id="category"
                  name="category"
                  value={subcategory.category}
                  onChange={handleSubCategoryChange}
                >
                  <option value="">Select a category...</option>
                  {categories.map((each, i) => (
                    <option key={i} value={each._id}>
                      {each.title}
                    </option>
                  ))}
                </select>
              </div>

              <button className="subcat-edit-button" type="submit">
                Update Subcategory
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryDash;
