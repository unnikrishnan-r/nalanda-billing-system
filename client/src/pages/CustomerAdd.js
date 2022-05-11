import React from 'react';
import { useForm } from 'react-hook-form';
export default function Addcustomer() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>New Customer</h4>
      <label>Customer name</label>
      <br></br>
      <input type="text" placeholder="Name" {...register("Name", { required: true, maxLength: 32 })} />
      <br></br>
      <label>Address</label>
      <br></br>
      <input type="text" placeholder="Address" {...register("Address", { required: true, maxLength: 100 })} />
      <br></br>
      <label>Phone</label>
      <br></br>
      <input type="tel" placeholder="Mobile Number" {...register("Mobile Number", { required: true, maxLength: 10 })} />
      <br></br>
      <label>Customer's Email</label>
      <br></br>
      <input type="text" placeholder="Email" {...register("Email", { required: true, maxLength: 30 })} />
      <br></br>
      <br></br>
      <label>Status</label>
      <label className="switch">
        <input type="checkbox"/>
          <span className="slider round"></span>
      </label>
      <br></br>
      <input type="submit" />
    </form>
  );
}