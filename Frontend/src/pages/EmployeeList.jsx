import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import EmployeeTable from "../components/Employeetable";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import {
  getEmployees,
  deleteEmployee,
} from "../utils/storage";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      // Clear navigation state so message does not
      // appear again after refreshing the page
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

 
  function closeMessage() {
    setMessage("");
  }

  

  function handleConfirmDelete() {
    if (!pendingDelete) return;

    deleteEmployee(pendingDelete.id);

    setEmployees(getEmployees());

    setPendingDelete(null);

    setMessage("Employee deleted successfully!");
  }

  return (
    <div className="space-y-5 font-[Poppins]">

      
      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Employee Details
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {employees.length} total employees
          </p>

        </div>


        

        <Link
          to="/admin-dashboard/employee-details/add"
          className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
        >
          + Add Employee
        </Link>

      </div>


      

      {message && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-start gap-4">

              {/* SUCCESS ICON */}

              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">

                <span className="text-[#9333EA] text-lg font-bold">
                  ✓
                </span>

              </div>


              {/* MESSAGE */}

              <div className="flex-1">

                <h3 className="text-base font-semibold text-slate-800">
                  Success
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {message}
                </p>

              </div>

            </div>


            {/* OK BUTTON */}

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


      
      <EmployeeTable
        employees={employees}
        onDeleteClick={setPendingDelete}
      />


     

      <ConfirmDeleteModal
        employee={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

    </div>
  );
}