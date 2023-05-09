import React, { useEffect, useState } from "react";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Sale.css";
import { Footer } from "../../component/Header/footer/footer";

const Sale = () => {
  const [menubar, setMenuBar] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // add state for totalPages
  const [cartStatus, setCartStatus] = useState([]);

  const userId = sessionStorage.getItem("Id");

  useEffect(() => {
    // console.log("jjjjj", currentPage);
    axios
      .get(
        `https://zoneoutlet-ckb5.onrender.com/products/sale/?page=${currentPage}`
      )
      .then((response) => {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages); // update totalPages state
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPage]);

  const handleCart = async (event, productId) => {
    event.preventDefault();
    console.log(productId);
    if (userId) {
      try {
        const response = await axios.post(
          `https://zoneoutlet-ckb5.onrender.com/cart/${userId}`,
          {
            productId: productId,
          }
        );
        setCartStatus("sucssful", response.data);
        Swal.fire({
          title: "Product added to cart!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-style",
            title: "custom-style",
            confirmButton: "custom-style",
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      const result = await Swal.fire({
        title: "You need to be logged in to add items to your cart",
        showCancelButton: true,
        confirmButtonText: "Log in",
        customClass: {
          popup: "custom-style",
          title: "custom-style",
          confirmButton: "custom-style",
        },
      });
      if (result.isConfirmed) {
        window.location.href = "/auth";
      }
    }
  };

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />
      <div className="sale-product-section">
        <div className="products-section">
          {products.map((product, id) => (
            <div className="product-card" key={id}>
              <Card
                key={id}
                sx={{ maxWidth: 250, border: "solid 1px #0B486A" }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="260"
                    image={`${product.image}`}
                    alt="product img"
                  />

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <CardContent>
                      <Link
                        className="product-link"
                        to={`/product/${product._id}`}
                      >
                        <Typography gutterBottom variant="h5" component="div">
                          {product.name.slice(0, 15)}...
                        </Typography>
                      </Link>
                      {product.discountPercentage ? (
                        <>
                          <div className="raneem">
                            <Typography
                              className="original-price3"
                              variant="body2"
                              color="text.secondary"
                              mb="-20px"
                              fontSize="20px"
                            >
                              ${product.price}
                            </Typography>
                            <Typography
                              className="discounted-price3"
                              variant="body2"
                              color="text.secondary"
                              mb="-20px"
                              fontSize="20px"
                            >
                              ${product.discountedPrice}
                            </Typography>
                          </div>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb="-20px"
                          fontSize="20px"
                        >
                          ${product.price}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <div
                        size="small"
                        onClick={(event) => handleCart(event, product._id)}
                        className="addto-cart"
                      >
                        ADD TO CART
                      </div>
                    </CardActions>
                  </Box>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
        <div className="stack-pagination">
          <Stack spacing={2}>
            <Pagination
              count={totalPages} // pass totalPages as prop
              shape="rounded"
              page={currentPage} // set the current active page
              onChange={(event, value) => setCurrentPage(value)} // update the currentPage when user clicks on a different page
              className="pagination"
            />
          </Stack>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Sale;
