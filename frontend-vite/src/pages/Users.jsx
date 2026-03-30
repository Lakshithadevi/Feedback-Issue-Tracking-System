import React, { useEffect, useState } from "react";
import Sidebar from "../components/AdminSidebar";
import axios from "axios";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  // ✅ Edit state
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://feedback-issue-tracking-system.onrender.com//users");
      setUsers(res.data || []);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // ✅ DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      await axios.delete(`https://feedback-issue-tracking-system.onrender.com/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ START EDIT
  const startEdit = (user) => {
    setEditUser(user._id);
    setFormData({
      name: user.name,
      email: user.email
    });
  };

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ SAVE EDIT
  const saveEdit = async () => {
    try {
      await axios.put(
        `https://feedback-issue-tracking-system.onrender.com/users/${editUser}`,
        formData
      );
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="users-layout">
      <Sidebar />

      <div className="users-container">
        <h2>Users Management</h2>

        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  {/* ✅ EDIT MODE */}
                  <td>
                    {editUser === user._id ? (
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      user.name || "N/A"
                    )}
                  </td>

                  <td>
                    {editUser === user._id ? (
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      user.email || "N/A"
                    )}
                  </td>

                  <td>
                    {editUser === user._id ? (
                      <>
                        <button className="save-btn" onClick={saveEdit}>
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditUser(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;