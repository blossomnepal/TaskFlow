import { useNavigate } from "react-router-dom";

import EmployeeForm from "../components/Employeeform";
import { addEmployee } from "../utils/storage";

export default function AddEmployee() {
  const navigate = useNavigate();

  function handleSubmit(values) {
    // Save employee
    addEmployee(values);

    // Return to Employee Details with success message
    navigate("/admin-dashboard/employee-details", {
      state: {
        message: "Employee added successfully!",
      },
    });
  }

  return (
    <div className="space-y-5 font-[Poppins]">

      {/* Page Header */}

      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Add Employee
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Add a new employee to the system
        </p>
      </div>


      {/* Employee Form */}

      <EmployeeForm
        onSubmit={handleSubmit}
        submitLabel="+ Add Employee"
      />

    </div>
  );
}