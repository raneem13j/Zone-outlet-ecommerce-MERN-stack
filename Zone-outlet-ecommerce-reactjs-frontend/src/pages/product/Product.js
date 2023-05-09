import React from "react";
import "./Product.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import ProductCarousel from "../../component/ProductCarousel/ProductCarousel";
import icon from "./images/icons8-right-arrow-32 (1).png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { Footer } from "../../component/Header/footer/footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, CardActions } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Product = () => {
  const [menubar, setMenuBar] = useState(false);
  const productId = useParams();
  const [totalPages, setTotalPages] = useState(1); // add state for totalPages
  const [currentPage, setCurrentPage] = useState(1);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cartStatus, setCartStatus] = useState([]);
  const userId = sessionStorage.getItem("Id");

  useEffect(() => {
    axios
      .get(
        `https://zoneoutlet-ckb5.onrender.com/products/${productId.productId}`
      )
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  useEffect(() => {
    // console.log("jjjjj", currentPage);
    axios
      .get(
        `https://zoneoutlet-ckb5.onrender.com/products/pag?page=${currentPage}`
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
      {loading ? (
        <ReactLoading
          className="loading-container"
          type="spinningBubbles"
          color="#FF7D00"
          height={200}
          width={100}
        />
      ) : (
        <div>
          <div className="product">
            <div className="product-section">
              <div className="carousel-product">
                <ProductCarousel
                  images={
                    product.images &&
                    product.images.map((item) => `${item.url}`)
                  }
                />
              </div>
              <div className="info-product">
                <div className="breadcramb">
                  <span className="span-product">
                    <Link to="/" className="link-product">
                      Home
                    </Link>
                  </span>
                  <img src={icon} alt="#" />
                  <span className="span-product">
                    <a
                      href={`/category/${product.category._id}`}
                      className="link-product"
                    >
                      Product
                    </a>
                  </span>
                  <img src={icon} alt="#" />
                  <span className="name-h4">
                    {product.name.slice(0, 20)}...
                  </span>
                </div>
                <h1>{product.name}...</h1>

                {product.discountPercentage ? (
                  <>
                    <p className="original-price">${product.price}</p>
                    <p className="discounted-price">
                      ${product.discountedPrice} ({product.discountPercentage}%
                      off)
                    </p>
                  </>
                ) : (
                  <p>${product.price}</p>
                )}
                <button
                  className="btn-add"
                  size="small"
                  onClick={(event) => handleCart(event, product._id)}
                >
                  ADD TO CART
                </button>

                <hr className="line-product1" />
                <p className="category-product">
                  Categories: {product.category.title},{" "}
                  {product.subcategory.title}
                </p>
                <hr className="line-product2" />
                <p className="des-product">Size: {product.size}</p>
                <hr className="line-product2" />
                <p className="des-product">Discription:{product.description}</p>
              </div>
            </div>
            <div className="product-section2"></div>
          </div>
          <h1 className="line-latest-section">Latest Drops</h1>
          <div className="products-section-R">
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
      )}
      <Footer />
    </>
  );
};

export default Product;
