import React, { useEffect, useState } from "react";
import baseUrl from "../apis/instance";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";
import { CREATED, OK } from "../constants/httpCode";
import { useDebounce } from "../hooks/useDebounce";

export default function DemoAxios() {
  const [users, setUsers] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const debouceSearch = useDebounce(searchValue, 300);

  const [user, setUser] = useState({
    userName: "",
    dateOfBirth: "",
    email: "",
    address: "",
  });
  const fetchUsers = async () => {
    try {
      //   const response = await axios.get("http://localhost:3000/users");
      const response = await baseUrl[GET](
        `users?userName_like=${debouceSearch}`
      );
      setUsers(response.data);
    } catch (error) {
      // Xử lý lỗi
    }
    // axios
    //   .get("http://localhost:3000/users")
    //   .then((response) => console.log(response.data))
    //   .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUsers();
  }, [debouceSearch]);

  // Gọi API lấy thông tin chi tiết user
  const handleGetInfo = async (id) => {
    try {
      const response = await baseUrl[GET](`users/${id}`);
      console.log(response.data);
    } catch (error) {}
  };

  //   Gọi API xóa thông tin user theo id
  const handleDelete = async (id) => {
    try {
      const response = await baseUrl[DELETE](`users/${id}`);

      if (response.status === 200) {
        fetchUsers();
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate...
    // Gọi API

    try {
      const response = await baseUrl[idEdit ? PUT : POST](
        `users/${idEdit}`,
        user
      );

      if (response) {
        fetchUsers();

        setUser({
          userName: "",
          dateOfBirth: "",
          email: "",
          address: "",
        });

        alert(`${response.status === OK ? "Cập nhât" : "Thêm mới"} thành công`);
      }
    } catch (error) {}

    // if (idEdit) {
    //   // Sửa
    //   try {
    //     const response = await baseUrl[PUT](`users/${idEdit}`, user);
    //     if (response.status === OK) {
    //       fetchUsers();
    //     }
    //   } catch (error) {}
    // } else {
    //   // Thêm
    //   try {
    //     const response = await baseUrl[POST](`users`, user);
    //     if (response.status === CREATED) {
    //       fetchUsers();
    //     }
    //   } catch (error) {}
    // }
  };

  const handleEdit = (user) => {
    setIdEdit(user.id);
    setUser(user);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <h3>List user</h3>
      <input onChange={handleSearch} type="text" />
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
