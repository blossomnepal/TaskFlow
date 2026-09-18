import { useEffect, useState } from "react";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";

import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../utils/storage";

import EmployeeSidebar from "../components/EmployeeSidebar";

const statusStyles = {
  Pending:
    "bg-purple-50 text-[#9333EA] border border-purple-100",

  "In Progress":
    "bg-blue-50 text-blue-600 border border-blue-100",

  Completed:
    "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeName: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // ==========================================
  // EXPAND / COLLAPSE
  // ==========================================

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // ==========================================
  // RESET FORM
  // ==========================================

  function resetForm() {
    setFormData({
      name: "",
      employeeName: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });

    setEditingId(null);
    setShowForm(false);
  }

  // ==========================================
  // CREATE PROJECT
  // ==========================================

  function handleAddClick() {
    setEditingId(null);

    setFormData({
      name: "",
      employeeName: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });

    setShowForm(true);
  }

  // ==========================================
  // EDIT PROJECT
  // ==========================================

  function handleEditClick(project) {
    setFormData({
      name: project.name || "",

      employeeName:
        project.doneBy ||
        project.assignedTo ||
        "",

      description:
        project.description || "",

      dueDate:
        project.dueDate || "",

      status:
        project.status || "Pending",
    });

    setEditingId(project.id);
    setShowForm(true);
  }

  // ==========================================
  // SUBMIT PROJECT
  // ==========================================

  function handleSubmit(e) {
    e.preventDefault();

    const projectData = {
      name: formData.name,

      doneBy: formData.employeeName,

      description: formData.description,

      dueDate: formData.dueDate,

      status: formData.status,
    };

    // EDIT
    if (editingId) {
      updateProject(
        editingId,
        projectData
      );

      setProjects(getProjects());

      resetForm();

      setMessage(
        "Project changes saved successfully!"
      );

      return;
    }

    // CREATE
    addProject(projectData);

    setProjects(getProjects());

    resetForm();

    setMessage(
      "Project created successfully!"
    );
  }

  // ==========================================
  // DELETE
  // ==========================================

  function handleDelete(id) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;

    deleteProject(deleteId);

    setProjects(getProjects());

    setDeleteId(null);

    setExpandedId(null);

    setMessage(
      "Project deleted successfully!"
    );
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  // ==========================================
  // FILTER
  // ==========================================

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (project) =>
            project.status === filter
        );

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // COUNTS
  // ==========================================

  const totalProjects =
    projects.length;

  const pendingProjects =
    projects.filter(
      (project) =>
        project.status === "Pending"
    ).length;

  const progressProjects =
    projects.filter(
      (project) =>
        project.status === "In Progress"
    ).length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status === "Completed"
    ).length;

  // ==========================================
  // OVERDUE
  // ==========================================

  function isOverdue(project) {
    return (
      project.dueDate &&
      project.dueDate < today &&
      project.status !== "Completed"
    );
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(date) {
    if (!date) {
      return "No due date";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <EmployeeSidebar />

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="flex-1 min-w-0 p-6">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Projects
            </h2>

            

          </div>

          {/* CREATE PROJECT */}

          <button
            onClick={handleAddClick}
            className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Create Project
          </button>

        </div>

        {/* ======================================
            STATISTICS
        ====================================== */}

        {!showForm && (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* TOTAL */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">

              <p className="text-xs text-slate-500">
                Total Projects
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {totalProjects}
              </p>

            </div>

            {/* PENDING */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">

              <p className="text-xs text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-[#9333EA] mt-1">
                {pendingProjects}
              </p>

            </div>

            {/* IN PROGRESS */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">

              <p className="text-xs text-slate-500">
                In Progress
              </p>

              <p className="text-2xl font-bold text-blue-600 mt-1">
                {progressProjects}
              </p>

            </div>

            {/* COMPLETED */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">

              <p className="text-xs text-slate-500">
                Completed
              </p>

              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {completedProjects}
              </p>

            </div>

          </div>

        )}

        {/* ======================================
            FILTER TABS
        ====================================== */}

        {!showForm && (

          <div className="flex items-center gap-6 border-b border-slate-200 mb-5 overflow-x-auto">

            {[
              "All",
              "Pending",
              "In Progress",
              "Completed",
            ].map((item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`pb-3 text-sm whitespace-nowrap transition-colors ${
                  filter === item
                    ? "text-[#9333EA] border-b-2 border-[#9333EA] font-medium"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        )}

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">

            <div className="bg-white w-full max-w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-base font-semibold text-slate-800">
                    Success
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {message}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setMessage("")
                  }
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="flex justify-end mt-6">

                <button
                  onClick={() =>
                    setMessage("")
                  }
                  className="px-5 py-2 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium"
                >
                  OK
                </button>

              </div>

            </div>

          </div>

        )}

        {/* ======================================
            DELETE CONFIRMATION
        ====================================== */}

        {deleteId && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">

            <div className="bg-white w-full max-w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

              <h3 className="text-base font-semibold text-slate-800">
                Delete Project?
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to delete
                this project? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={cancelDelete}
                  className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}

        {/* ======================================
            CREATE / EDIT FORM
        ====================================== */}

        {showForm && (

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="text-lg font-semibold text-slate-800">
                  {editingId
                    ? "Edit Project"
                    : "Create Project"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Enter the project details below.
                </p>

              </div>

              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* PROJECT NAME */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />

                </div>

                {/* DONE BY */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Done By
                  </label>

                  <input
                    type="text"
                    name="employeeName"
                    value={
                      formData.employeeName
                    }
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Describe the project..."
                    rows={4}
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none resize-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />

                </div>

                {/* DUE DATE */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate
                    }
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />

                </div>

                {/* STATUS */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none bg-white focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium"
                >
                  {editingId
                    ? "Save Changes"
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* ======================================
            PROJECT LIST
        ====================================== */}

        {!showForm && (

          <>

            {filteredProjects.length === 0 ? (

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-14 text-center">

                <h3 className="text-base font-semibold text-slate-700">
                  No projects found
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Click "Create Project" to create
                  your first project.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {filteredProjects.map(
                  (project) => {

                    const overdue =
                      isOverdue(project);

                    const isOpen =
                      expandedId ===
                      project.id;

                    return (

                      <div
                        key={project.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                      >

                        {/* ==================================
                            COLLAPSED PROJECT HEADER
                            DUE DATE IS NOT SHOWN HERE
                        ================================== */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleExpand(
                              project.id
                            )
                          }
                          className="w-full flex items-center text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                        >

                          {/* PROJECT NAME + DONE BY */}

                          <div className="flex-1 min-w-0 pr-4">

                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                              {project.name}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1">
                              By{" "}
                              {project.doneBy ||
                                project.assignedTo ||
                                "Unknown"}
                            </p>

                          </div>

                          {/* STATUS */}

                          <div className="shrink-0 mr-8">

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                statusStyles[
                                  project.status
                                ] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {project.status}
                            </span>

                          </div>

                          {/* ARROW - EXTREME RIGHT */}

                          <div className="w-5 shrink-0 flex justify-end">

                            <ChevronDown
                              size={19}
                              className={`text-slate-400 transition-transform duration-200 ${
                                isOpen
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />

                          </div>

                        </button>

                        {/* ==================================
                            EXPANDED DETAILS
                            DUE DATE APPEARS ONLY HERE
                        ================================== */}

                        {isOpen && (

                          <div className="border-t border-slate-100 px-5 py-5">

                            {/* DESCRIPTION */}

                            <div className="mb-5">

                              <p className="text-xs font-medium text-slate-500 mb-2">
                                Description
                              </p>

                              <p className="text-sm text-slate-600 leading-6">
                                {project.description ||
                                  "No description provided."}
                              </p>

                            </div>

                            {/* DETAILS */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                              {/* DONE BY */}

                              <div className="bg-slate-50 rounded-lg p-3">

                                <p className="text-xs text-slate-400">
                                  Done By
                                </p>

                                <p className="text-sm font-medium text-slate-700 mt-1">
                                  {project.doneBy ||
                                    project.assignedTo ||
                                    "Unknown"}
                                </p>

                              </div>

                              {/* DUE DATE */}

                              <div
                                className={`rounded-lg p-3 ${
                                  overdue
                                    ? "bg-red-50"
                                    : "bg-slate-50"
                                }`}
                              >

                                <p
                                  className={`text-xs ${
                                    overdue
                                      ? "text-red-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  Due Date
                                </p>

                                <p
                                  className={`text-sm font-medium mt-1 ${
                                    overdue
                                      ? "text-red-600"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {formatDate(
                                    project.dueDate
                                  )}
                                </p>

                                {overdue && (

                                  <p className="text-[11px] text-red-500 mt-1">
                                    Overdue
                                  </p>

                                )}

                              </div>

                            </div>

                            {/* ==================================
                                EDIT DELETE
                            ================================== */}

                            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditClick(
                                    project
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 text-[#9333EA] hover:bg-purple-200 rounded-md text-xs font-medium transition-colors"
                              >

                                <Pencil
                                  size={14}
                                />

                                Edit

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    project.id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium transition-colors"
                              >

                                <Trash2
                                  size={14}
                                />

                                Delete

                              </button>

                            </div>

                          </div>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </>

        )}

      </main>

    </div>
  );
}