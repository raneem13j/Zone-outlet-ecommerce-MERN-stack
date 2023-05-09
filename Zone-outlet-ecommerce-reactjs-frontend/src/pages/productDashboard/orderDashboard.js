import React, { useState, useEffect } from "react";
import axios from "axios";
import "./orderDashboard.css";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { Footer } from "../../component/Header/footer/footer";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const [menubar, setMenuBar] = useState(false);

  const [users, setUsers] = useState([]);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://zoneoutlet-ckb5.onrender.com/orders/"
        );
        console.log(response.data);
        sessionStorage.getItem(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);
  const handleAdd = () => {
    setAddMode(true);
  };
  const updateOrderStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        `https://zoneoutlet-ckb5.onrender.com/orders/${id}`,
        {
          status: status,
        }
      );
      console.log(response.data);
      // If the request is successful, you can update the status of the order in your state
      // For example, you can find the index of the order in your state array and update it like this:
      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((user) => user._id === id);
      updatedUsers[index].status = status;
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />
      <div className="go-order-button">
        <button className="add-subcategory-button" onClick={handleAdd}>
          <Link to="/proDash" className="go-order-link">
            Go to Products Dashboard
          </Link>
        </button>
      </div>
      <h1 className="orderdashboard-title">Users Who Ordered</h1>
      <br />
      <div className="table-wrapper-order">
        <table className="Orderdash-table">
          <thead>
            <td>Username</td>
            <td>Phone Number</td>
            <td>Address</td>
            <td>Products</td>
            <td>Total Price</td>
            <td>Status</td>
          </thead>
          <tbody className="order-body">
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.user.username}</td>
                <td>{user.user.phonenumber}</td>
                <td>{user.user.address}</td>
                <td>
                  {user.products.map((item) => (
                    <tr key={item._id}>
                      {item.product && (
                        <td>
                          <img
                            className="dashboard-product-image"
                            src={`${item.product.image}`}
                          />
                          <td>{item.product.name}</td>
                        </td>
                      )}
                    </tr>
                  ))}
                </td>
                <td>{user.total_price}</td>
                <td>
                  <select
                    className="status-button"
                    value={user.status}
                    onChange={(e) =>
                      updateOrderStatus(user._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};
export default UserOrders;
