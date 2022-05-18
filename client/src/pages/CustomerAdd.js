import React from 'react';
import { useState } from "react";
function Addcustomer() {
  const [CustomerName, setName] = useState("");
  const [CustomerEmail, setEmail] = useState("");
  const [CustomerAddress, setAddress] = useState("");
  const [CustomerPhone, setMobileNumber] = useState("");
  const [CustomerStatus, setCustomerStatus] = useState("");
  const [message, setMessage] = useState("");
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("https://nalandaapi.herokuapp.com/api/newcustomer", {
        method: "POST",
        body: JSON.stringify({
          customerName: CustomerName,
          customerEmail: CustomerEmail,
          customerAddress: CustomerAddress,
          customerStatus: CustomerStatus,
          customerPhone: CustomerPhone,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setName("");
        setEmail("");
        setAddress("");
        setMobileNumber("");
        setCustomerStatus("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h4>New Customer</h4>
      <label>Customer name</label>
      <br></br>
      <input type="text" placeholder="Name" value={CustomerName} onChange={(e) => setName(e.target.value)} />
      <br></br>
      <label>Address</label>
      <br></br>
      <input type="text" placeholder="Address" value={CustomerAddress} onChange={(e) => setAddress(e.target.value)} />
      <br></br>
      <label>Phone</label>
      <br></br>
      <input type="tel" placeholder="Mobile Number" value={CustomerPhone} onChange={(e) => setMobileNumber(e.target.value)} />
      <br></br>
      <label>Customer's Email</label>
      <br></br>
      <input type="text" placeholder="Email" value={CustomerEmail} onChange={(e) => setEmail(e.target.value)} />
      <br></br>
      <br></br>
      <label>Status</label>
      <label className="switch">
        <input type="checkbox" value={CustomerStatus} onChange={(e) => setCustomerStatus(e.target.value)} />
        <span className="slider round"></span>
      </label>
      <br></br>
      <input type="submit" />
      <div className="message">{message ? <p>{message}</p> : null}</div>
    </form>
  );
}
export default Addcustomer;









