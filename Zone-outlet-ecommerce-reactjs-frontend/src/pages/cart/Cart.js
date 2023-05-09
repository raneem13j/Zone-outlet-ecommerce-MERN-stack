import React, { useState, useEffect } from "react";
import "./Cart.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import emailjs from "@emailjs/browser";

import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { Footer } from "../../component/Header/footer/footer";
import { Link } from "react-router-dom";

const Cart = () => {
  const userId = sessionStorage.getItem("Id");
  const [menubar, setMenuBar] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, settotalData] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);

  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://zoneoutlet-ckb5.onrender.com/cart/${userId}`
        );
        const data = await response.json();
        setTableData(data.items);
        settotalData(data);
        console.log("dfdf", totalData);
        console.log("ssss", tableData);
        if (data.items.length > 0) {
          setHasItems(true);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { id: "remove", label: " ", minWidth: 100 },
    { id: "image", label: "Image", minWidth: 100 },
    { id: "product", label: "Product", minWidth: 100 },
    { id: "size", label: "Size", minWidth: 100 },
    { id: "price", label: "Price", minWidth: 100 },
  ];

  const handleRemove = async (userId, productId) => {
    await Swal.fire({
      title: "Are you sure you want to delete this item from your cart?",
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
        const response = await fetch(
          `https://zoneoutlet-ckb5.onrender.com/cart/${userId}/${productId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTableData(
            tableData.filter((item) => item.productId._id !== productId)
          );
          settotalData(data);
          // Check if there are any items left in the cart
          if (data.items.length === 0) {
            setHasItems(false);
          }
        } else {
          console.error("Failed to remove item");
        }
      }
    });
  };

  const handleOrder = () => {
    // send POST request to place order function
    fetch("https://zoneoutlet-ckb5.onrender.com/orders", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // set order status to success
          setOrderStatus("success");
          // send email

          const serviceId = "service_fyhs1bs";
          const templateId = "template_axzix4f";
          const userId = "PiwL_rIX2-s0Sa9oC";
          const templateParams = {
            name: totalData.userId.username,
            address: totalData.userId.address,
            phonenumber: totalData.userId.phonenumber,
            total: totalData.bill.toFixed(2),
            items: tableData.map((item) => item.productId.name),
            message: "You have a new order to prosses",
          };
          console.log("here", totalData);

          emailjs.send(serviceId, templateId, templateParams, userId).then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function (error) {
              console.log("FAILED...", error);
            }
          );
          Swal.fire({
            icon: "success",
            title: "Order placed successfully!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "/cart";
          });
        } else {
          // set order status to failure
          setOrderStatus("failure");
          Swal.fire({
            icon: "error",
            title: "Failed to place order.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        console.log("rana", orderStatus);
      })
      .catch((error) => {
        // set order status to failure
        setOrderStatus("failure");
        Swal.fire({
          icon: "error",
          title: "Failed to place order.",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />
      {!userId ? (
        <div className="cart-wrapper-div1">
          <div className="cart-header">
            <h1 className="cart-title-b">Please log in to access your cart.</h1>
          </div>
          <div className="cart-login">
            <Link to="/auth" className="cart-login-link">
              Login
            </Link>
          </div>
        </div>
      ) : hasItems ? (
        <div className="cart-wrapper">
          <div className="cart-header">
            <h1 className="cart-title">Cart</h1>
          </div>

          <div className="cart-table">
            <Paper
              sx={{
                width: "70%",
                overflow: "hidden",
                marginLeft: "auto",
                marginRight: "auto",
                border: "#0B486A solid 1px",
              }}
            >
              <TableContainer sx={{ maxHeight: 440 }}>
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
                    {tableData?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <button
                            onClick={() =>
                              handleRemove(userId, item.productId._id)
                            }
                            className="cart-button-icon"
                          >
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="cart-Xicon"
                            />
                          </button>
                        </TableCell>
                        <TableCell className="cart-item-image">
                          <img
                            src={`${item.productId.image}`}
                            alt={item.product}
                          />
                        </TableCell>
                        <TableCell>{item.productId.name}</TableCell>
                        <TableCell>{item.productId.size}</TableCell>
                        <TableCell>{item.productId.discountedPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className="cart-totals">
            <div className="cart-totals-first">
              <p>Total</p>
              <p>$ {totalData.bill.toFixed(2)}</p>
            </div>
            <div className="cart-totals-second">
              <button
                className="cart-totals-second-button"
                onClick={handleOrder}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart-wrapper-empty">
          <h1 className="text-empty">Your cart is empty.</h1>
        </div>
      )}
      <Footer />
    </>
  );
};
export default Cart;
