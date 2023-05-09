import React, { useState, useEffect } from "react";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { Footer } from "../../component/Header/footer/footer";
import Swal from "sweetalert2";
import "./profile.css";
const User = () => {
  const [menubar, setMenuBar] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState({});
  const id = sessionStorage.getItem("Id");
  console.log(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://zoneoutlet-ckb5.onrender.com/api/user/${id}`
        );
        const data = await response.json();
        setUser(data);
        setPhoneNumber(data.phonenumber);
        setAddress(data.address);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [id]);

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://zoneoutlet-ckb5.onrender.com/api/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            address: address,
            phonenumber: phoneNumber,
          }),
        }
      );
      const data = await response.json();
      console.log("Updated Successfully");

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated successfully",
        });
        return data.user;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />
      <form onSubmit={updateUser}>
        <div className="user-form">
          <div className="user-username">
            <p>
              Username: <br />
              <br />
              {user.username}
            </p>
          </div>
          <div className="update-label">
            <div className="address-label">
              <label className="update-Address">
                Address:
                <br />
                <input
                  className="user-inputs"
                  type="text"
                  value={address}
                  placeholder="New Address"
                  onChange={(event) => setAddress(event.target.value)}
                />
              </label>
            </div>
            <div className="phonenumber-label">
              <label className="update-phonenumber">
                Phonenumber:
                <br />
                <input
                  className="user-inputs"
                  type="text"
                  value={phoneNumber}
                  placeholder="phonenumber"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </label>
            </div>
          </div>
          <button className="submit-button" type="submit">
            Update
          </button>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default User;
