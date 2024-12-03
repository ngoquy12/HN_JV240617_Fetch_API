import React, { useEffect, useState } from "react";

export default function DemoFetchApi() {
  const [users, setUsers] = useState([]);
  const [idEdit, setIdEdit] = useState(null);
  const [user, setUser] = useState({
    userName: "",
    dateOfBirth: "",
    email: "",
    address: "",
  });

  // Gọi API lấy danh sách tất cả user
  const fetchUsers = () => {
    fetch("http://localhost:3000/users", {
      method: "GET",
    })
      .then((reponse) => reponse.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error))
      .finally(() => console.log("Hoàn thành"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gọi API lấy thông tin chi tiết user
  const handleGetInfo = (id) => {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "GET",
    })
      .then((reponse) => reponse.json())
      .then((data) => console.log("User info:", data))
      .catch((error) => console.log(error))
      .finally(() => console.log("Hoàn thành"));
  };

  //   Gọi API xóa thông tin user theo id
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then((data) => {
        if (data.ok) {
          // Load lại giao diện
          fetchUsers();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => console.log("Hoàn thành"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate...
    // Gọi API

    if (idEdit) {
      // Sửa
      fetch(`http://localhost:3000/users/${idEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.status === 200) {
            fetchUsers();
          }
        })
        .catch((error) => console.log(error));
    } else {
      // Thêm
      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.status === 201) {
            fetchUsers();
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleEdit = (user) => {
    setIdEdit(user.id);
    setUser(user);
  };

  return (
    <div>
      <h3>List user</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Name</th>
            <th>DateBirth</th>
            <th>Email</th>
            <th>Address</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.dateOfBirth}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>
                <button onClick={() => handleGetInfo(user.id)}>
                  View detail
                </button>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Name</label>
          <input
            value={user.userName}
            onChange={handleChange}
            name="userName"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="">DateOfBirth</label>
          <input
            value={user.dateOfBirth}
            onChange={handleChange}
            name="dateOfBirth"
            type="date"
          />
        </div>
        <div>
          <label htmlFor="">Email</label>
          <input
            value={user.email}
            onChange={handleChange}
            name="email"
            type="email"
          />
        </div>
        <div>
          <label htmlFor="">Address</label>
          <input
            value={user.address}
            onChange={handleChange}
            name="address"
            type="text"
          />
        </div>
        <button type="submit">{idEdit ? "Lưu" : "Thêm"}</button>
      </form>
    </div>
  );
}
