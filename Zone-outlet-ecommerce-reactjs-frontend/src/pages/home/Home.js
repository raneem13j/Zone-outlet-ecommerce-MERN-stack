import React from "react";
import "./Home.css";
import sale from "./images/e20be251-9e01-4175-8cdf-231450c3d9d1.jpeg";
import men from "./images/male-looks-casual-wear-style.jpeg";
import women from "./images/lp-header-m.jpeg";
import child from "./images/istockphoto-674315022-612x612 .jpeg";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, CardActions } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import icon1 from "./images/icons8-man-60.png";
import Swal from "sweetalert2";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { Footer } from "../../component/Header/footer/footer";

const Home = ({ countdownDate, setCountdownDate }) => {
  const [menubar, setMenuBar] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // add state for totalPages
  const [cartStatus, setCartStatus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [dash, setDash] = useState(false);

  let interval = useRef();

  const startTimer = () => {
    // check if countdownDate exists and is not in the past
    if (!countdownDate || new Date(countdownDate) < new Date()) {
      return;
    }
    const countdownTime = new Date(countdownDate).getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownTime - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        //stop our timer
        clearInterval(interval.current);
      } else {
        //update timer
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    const storedCountdownDate = localStorage.getItem("countdownDate");
    if (storedCountdownDate) {
      setCountdownDate(storedCountdownDate); // Set the countdown date from localStorage
    }
  }, []);

  //componentDidMount
  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, [countdownDate]);

  const userId = sessionStorage.getItem("Id");
  useEffect(() => {
    axios
      .get("https://zoneoutlet-ckb5.onrender.com/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  // Sort products by date_added in descending order
  products.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

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

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "admin") {
      setDash(true); // update `dash` state to true if the user role is admin
    }
  }, []);

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />
      {dash && (
        <div className="go-order-button">
          <button className="add-subcategory-button">
            <Link to="/proDash" className="go-order-link">
              Go to Dashboard
            </Link>
          </button>
        </div>
      )}
      <div className="home-section">
        <div className="sale-section">
          <div className="img-sale-section">
            <img src={sale} alt="#" />
          </div>
          <div className="line-sale-section">
            <h2 className="line">Special Sale !!</h2>
            <h2>GET UP TO 20% OFF</h2>
            <Link className="sale-link" to={"/sale"}>
              SHOP NOW
            </Link>
          </div>
        </div>
        <h1 className="line-category-section">Categories</h1>
        <div className="list-category-section">
          {categories.map((category, id) => (
            <Link
              key={id}
              to={`/category/${category._id}`}
              className="link-category"
            >
              <img className="lic1" src={icon1} alt="#" />
              {category.title}’s Wear
            </Link>
          ))}
        </div>
        <div className="category-section">
          <img src={men} className="img1" alt="#" />
          <img src={women} className="img2" alt="#" />
          <img src={child} className="img3" alt="#" />
        </div>
        <div className="category1-section">
          {categories.map((category, id) => (
            <button className="category-button" key={id}>
              <Link
                key={id}
                className="link1-category"
                to={`/category/${category._id}`}
              >
                {category.title}
              </Link>
            </button>
          ))}
        </div>
        {countdownDate && new Date(countdownDate) >= new Date() && (
          <section className="timer-container">
            <section className="timer">
              <div>
                <h2 className="timer-h2">NEW ITEMS COMING IN!</h2>
              </div>
              <div className="timer-main">
                <section>
                  <p>{timerDays}</p>
                  <p className="timer-p">
                    <small>Days</small>
                  </p>
                </section>
                <span>:</span>
                <section>
                  <p className="two-numbers">{timerHours}</p>
                  <p className="timer-p">
                    <small>Hours</small>
                  </p>
                </section>
                <span>:</span>
                <section>
                  <p className="two-numbers">{timerMinutes}</p>
                  <p className="timer-p">
                    <small>Minutes</small>
                  </p>
                </section>
                <span>:</span>
                <section>
                  <p className="two-numbers">{timerSeconds}</p>
                  <p className="timer-p">
                    <small>Seconds</small>
                  </p>
                </section>
              </div>
            </section>
          </section>
        )}
        <h1 className="line-latest-section">Latest Drops</h1>
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

export default Home;
