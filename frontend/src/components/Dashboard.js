import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { useAuth } from "../contexts/AuthContext";
import { Plus, LogOut, Filter, RefreshCw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Delete lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
    }
    try {
      await axios.delete(`/api/leads/${leadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // if formData is plain JSON
        },
      });
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  // AG Grid column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "first_name",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const lead = params.data;
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {lead.first_name} {lead.last_name}
              </span>
              <span className="text-sm text-gray-500">{lead.email}</span>
            </div>
          );
        },
      },
      {
        headerName: "Company",
        field: "company",
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerName: "Phone",
        field: "phone",
        sortable: true,
        filter: true,
        width: 140,
      },
      {
        headerName: "Location",
        field: "city",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const lead = params.data;
          return `${lead.city}, ${lead.state}`;
        },
        width: 120,
      },
      {
        headerName: "Source",
        field: "source",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const source = params.value;
          const sourceColors = {
            website: "bg-blue-100 text-blue-800",
            facebook_ads: "bg-purple-100 text-purple-800",
            google_ads: "bg-red-100 text-red-800",
            referral: "bg-green-100 text-green-800",
            events: "bg-yellow-100 text-yellow-800",
            other: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                sourceColors[source] || sourceColors.other
              }`}
            >
              {source.replace("_", " ")}
            </span>
          );
        },
        width: 120,
      },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const status = params.value;
          const statusColors = {
            new: "bg-gray-100 text-gray-800",
            contacted: "bg-blue-100 text-blue-800",
            qualified: "bg-green-100 text-green-800",
            lost: "bg-red-100 text-red-800",
            won: "bg-emerald-100 text-emerald-800",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status] || statusColors.new
              }`}
            >
              {status}
            </span>
          );
        },
        width: 100,
      },
      {
        headerName: "Score",
        field: "score",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const score = params.value;
          let color = "text-gray-600";
          if (score >= 80) color = "text-green-600";
          else if (score >= 60) color = "text-yellow-600";
          else if (score >= 40) color = "text-orange-600";
          else color = "text-red-600";

          return <span className={`font-medium ${color}`}>{score}</span>;
        },
        width: 80,
      },
      {
        headerName: "Value",
        field: "lead_value",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const value = params.value;
          return value ? `$${value.toLocaleString()}` : "-";
        },
        width: 100,
      },
      {
        headerName: "Qualified",
        field: "is_qualified",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const qualified = params.value;
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                qualified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {qualified ? "Yes" : "No"}
            </span>
          );
        },
        width: 80,
      },
      {
        headerName: "Actions",
        field: "actions",
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const lead = params.data;
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/leads/${lead._id}/edit`)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteLead(lead._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          );
        },
        width: 120,
      },
    ],
    [navigate, handleDeleteLead]
  );

  // AG Grid default column properties
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      floatingFilter: true,
    }),
    []
  );

  // Fetch leads with pagination and filters
  const fetchLeads = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      console.log("Fetching leads with params:", queryParams.toString());
      const response = await axios.get(`/api/leads?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // if formData is plain JSON
        },
      });
      console.log("API Response:", response.data);
      console.log("Leads data:", response.data.data);
      console.log("Number of leads:", response.data.data?.length);

      setLeads(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Fetch leads when dependencies change
  useEffect(() => {
    console.log("Dashboard useEffect - User:", user);
    console.log("Dashboard useEffect - User ID:", user?._id);
    if (user) {
      fetchLeads();
    } else {
      console.log("No user found, not fetching leads");
    }
  }, [fetchLeads, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lead Management
              </h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/leads/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={fetchLeads}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                    <option value="won">Won</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={filters.source || ""}
                    onChange={(e) =>
                      handleFilterChange("source", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Sources</option>
                    <option value="website">Website</option>
                    <option value="facebook_ads">Facebook Ads</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="referral">Referral</option>
                    <option value="events">Events</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.score || ""}
                    onChange={(e) =>
                      handleFilterChange("score", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualified
                  </label>
                  <select
                    value={filters.is_qualified || ""}
                    onChange={(e) =>
                      handleFilterChange("is_qualified", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leads Grid */}
        <div className="px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            {/* Debug Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <strong>Debug Info:</strong> Leads count: {leads.length},
                Loading: {loading.toString()}, Page: {pagination.page}, Total:{" "}
                {pagination.total}, TotalPages: {pagination.totalPages}
              </div>
              {leads.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  First lead: {leads[0]?.first_name} {leads[0]?.last_name} (
                  {leads[0]?.email})
                </div>
              )}
            </div>

            <div className="ag-theme-alpine w-full" style={{ height: "600px" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={leads}
                defaultColDef={defaultColDef}
                pagination={false}
                paginationPageSize={pagination.limit}
                domLayout="autoHeight"
                suppressRowClickSelection={true}
                suppressCellFocus={true}
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 sm:px-0 mt-6">
            <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
