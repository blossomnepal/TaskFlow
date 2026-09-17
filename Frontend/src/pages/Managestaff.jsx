import { useEffect, useState } from "react";

import {
  getStaffAccounts,
  addStaffAccount,
  updateStaffAccount,
  deleteStaffAccount,
  getEmployees,
} from "../utils/storage";

export default function ManageStaff() {
  

  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    username: "",
    position: "",
    password: "",
  });



  useEffect(() => {
    setAccounts(getStaffAccounts());
    setEmployees(getEmployees());
  }, []);

  
  function handleChange(e) {
    const { name, value } = e.target;

    // Name is MANUAL
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
      }));

      // Find employee using typed name
      const employee = employees.find(
        (emp) =>
          emp.name?.toLowerCase().trim() ===
          value.toLowerCase().trim()
      );

      // Automatically fill employee information
      if (employee) {
        setFormData((prev) => ({
          ...prev,

          // Keep manually entered name
          name: value,

          // Automatic
          email: employee.email || "",
          contact: employee.phone || employee.contact || "",
          position: employee.position || "",
        }));
      } else {
        // If employee is not found,
        // clear only automatically filled fields.
        setFormData((prev) => ({
          ...prev,
          name: value,
          email: "",
          contact: "",
          position: "",
        }));
      }

      return;
    }

    // Username and Password remain MANUAL
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function showMessage(text) {
    setMessage(text);
  }

  function closeMessage() {
    setMessage("");
  }

  

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      contact: "",
      username: "",
      position: "",
      password: "",
    });

    setEditingId(null);
    setShowForm(false);
  }

  

  function handleCreateAccount() {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      contact: "",
      username: "",
      position: "",
      password: "",
    });

    // Refresh employees in case Employee Details
    // were recently changed.
    setEmployees(getEmployees());

    setShowForm(true);
  }

  

  function handleSubmit(e) {
    e.preventDefault();

    

    if (editingId) {
      updateStaffAccount(editingId, {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
        position: formData.position,
      });

      setAccounts(getStaffAccounts());

      resetForm();

      showMessage("Account changes saved successfully!");
    }

    

    else {
      addStaffAccount({
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
        position: formData.position,
        password: formData.password,
      });

      setAccounts(getStaffAccounts());

      resetForm();

      showMessage("Staff account created successfully!");
    }
  }

  

  function handleEdit(account) {
    setFormData({
      name: account.name || "",
      email: account.email || "",
      contact: account.contact || "",
      username: account.username || "",
      position: account.position || "",
      password: "",
    });

    setEditingId(account.id);
    setShowForm(true);
  }

  

  function handleDelete(id) {
    setDeleteId(id);
  }

  

  function confirmDelete() {
    if (!deleteId) {
      return;
    }

    deleteStaffAccount(deleteId);

    setAccounts(getStaffAccounts());

    setDeleteId(null);

    showMessage("Account deleted successfully!");
  }

  

  function cancelDelete() {
    setDeleteId(null);
  }

 

  return (
    <div className="space-y-5 font-[Poppins]">

      

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Manage Staff
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Create and manage staff accounts.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleCreateAccount}
            className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
          >
            + Create Account
          </button>
        )}

      </div>


      
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-[#9333EA] text-lg font-bold">
                  ✓
                </span>
              </div>

              <div className="flex-1">

                <h3 className="text-base font-semibold text-slate-800">
                  Success
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {message}
                </p>

              </div>

            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={closeMessage}
                className="px-5 py-2 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors"
              >
                OK
              </button>

            </div>

          </div>

        </div>
      )}


      
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-red-600 text-lg font-bold">
                  !
                </span>
              </div>

              <div className="flex-1">

                <h3 className="text-base font-semibold text-slate-800">
                  Delete Account?
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this account?
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={cancelDelete}
                className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}


      
      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h3 className="text-lg font-semibold text-slate-800 mb-5">
            {editingId
              ? "Edit Staff Account"
              : "Create Staff Account"}
          </h3>


          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


              

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Staff Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />

               

              </div>



              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  placeholder="Automatically filled"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none text-slate-600"
                />

              </div>


              
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact No.
                </label>

                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  readOnly
                  placeholder="Automatically filled"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none text-slate-600"
                />

              </div>


              

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Create username"
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />

              </div>


              

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  readOnly
                  placeholder="Automatically filled"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none text-slate-600"
                />

              </div>


             

              {!editingId && (

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />

                </div>

              )}

            </div>


            
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors"
              >
                {editingId
                  ? "Save Changes"
                  : "Create Account"}
              </button>

            </div>

          </form>

        </div>

      )}


      

      {!showForm && (

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-200">

            <h3 className="text-lg font-semibold text-slate-800">
              Staff Accounts
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {accounts.length} total accounts
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Staff Name
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Username
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Email
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Contact No.
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Position
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {accounts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-8 text-sm text-slate-500"
                    >
                      No staff accounts created yet.
                    </td>

                  </tr>

                ) : (

                  accounts.map((account) => (

                    <tr
                      key={account.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >

                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {account.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.username}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.contact}
                      </td>

                      <td className="px-6 py-4">

                        <span className="px-2.5 py-1 bg-purple-100 text-[#9333EA] rounded-md text-xs font-medium">
                          {account.position}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(account)
                            }
                            className="px-3 py-1.5 bg-purple-100 text-[#9333EA] hover:bg-purple-200 rounded-md text-xs font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(account.id)
                            }
                            className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}