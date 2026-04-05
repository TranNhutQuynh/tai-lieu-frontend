import { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);

  const [pendingDocs, setPendingDocs] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [docSearch, setDocSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [message, setMessage] = useState("");
  const [editingDocId, setEditingDocId] = useState("");
  const [editDocForm, setEditDocForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    description: "",
  });

  const [subjectForm, setSubjectForm] = useState({
    subjectCode: "",
    subjectName: "",
    facultyId: "",
    credit: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const fetchStats = async () => {
    const res = await http.get("/admin/stats");
    setStats(res.data);
  };

  const fetchPendingDocs = async (q = "") => {
    const res = await http.get(
      `/admin/documents/pending?q=${encodeURIComponent(q)}`
    );
    setPendingDocs(res.data);
  };

  const fetchAllDocs = async (q = "") => {
    const res = await http.get(`/admin/documents?q=${encodeURIComponent(q)}`);
    setAllDocs(res.data);
  };

  const fetchUsers = async (q = "") => {
    const res = await http.get(`/admin/users?q=${encodeURIComponent(q)}`);
    setUsers(res.data);
  };

  const fetchFaculties = async (q = "") => {
    const res = await http.get(`/admin/faculties?q=${encodeURIComponent(q)}`);
    setFaculties(res.data);
  };

  const fetchSubjects = async (q = "") => {
    const res = await http.get(`/admin/subjects?q=${encodeURIComponent(q)}`);
    setSubjects(res.data);
  };

  const fetchCategories = async (q = "") => {
    const res = await http.get(`/admin/categories?q=${encodeURIComponent(q)}`);
    setCategories(res.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchPendingDocs(),
          fetchAllDocs(),
          fetchUsers(),
          fetchFaculties(),
          fetchSubjects(),
          fetchCategories(),
        ]);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Không tải được dữ liệu quản trị"
        );
      }
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await http.patch(`/admin/documents/${id}/approve`);
      fetchPendingDocs(docSearch);
      fetchAllDocs(docSearch);
      fetchStats();
    } catch {
      setMessage("Phê duyệt thất bại");
    }
  };

  const handleReject = async (id) => {
    try {
      await http.patch(`/admin/documents/${id}/reject`);
      fetchPendingDocs(docSearch);
      fetchAllDocs(docSearch);
      fetchStats();
    } catch {
      setMessage("Từ chối thất bại");
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    try {
      await http.delete(`/admin/documents/${id}`);
      fetchPendingDocs(docSearch);
      fetchAllDocs(docSearch);
      fetchStats();
    } catch {
      setMessage("Xóa tài liệu thất bại");
    }
  };

  const handleStartEditDoc = (doc) => {
    setEditingDocId(doc._id);
    setEditDocForm({
      title: doc.title || "",
      description: doc.description || "",
      status: doc.status || "pending",
    });
  };

  const handleSaveEditDoc = async (id) => {
    try {
      await http.put(`/admin/documents/${id}`, editDocForm);
      setEditingDocId("");
      fetchAllDocs(docSearch);
      fetchPendingDocs(docSearch);
    } catch {
      setMessage("Cập nhật tài liệu thất bại");
    }
  };

  const handleChangeRole = async (id, role) => {
    try {
      await http.patch(`/admin/users/${id}/role`, { role });
      fetchUsers(userSearch);
    } catch {
      setMessage("Cập nhật role thất bại");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      await http.delete(`/admin/users/${id}`);
      fetchUsers(userSearch);
      fetchStats();
    } catch {
      setMessage("Xóa người dùng thất bại");
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      await http.post("/admin/faculties", facultyForm);
      setFacultyForm({ name: "", description: "" });
      fetchFaculties(facultySearch);
      fetchStats();
      setMessage("Thêm khoa thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Thêm khoa thất bại");
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoa này?")) return;

    try {
      await http.delete(`/admin/faculties/${id}`);
      fetchFaculties(facultySearch);
      fetchStats();
      setMessage("Xóa khoa thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Xóa khoa thất bại");
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await http.post("/admin/subjects", subjectForm);
      setSubjectForm({
        subjectCode: "",
        subjectName: "",
        facultyId: "",
        credit: "",
      });
      fetchSubjects(subjectSearch);
      fetchStats();
      setMessage("Thêm môn học thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Thêm môn học thất bại");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa môn học này?")) return;

    try {
      await http.delete(`/admin/subjects/${id}`);
      fetchSubjects(subjectSearch);
      fetchStats();
      setMessage("Xóa môn học thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Xóa môn học thất bại");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await http.post("/admin/categories", categoryForm);
      setCategoryForm({ name: "", description: "" });
      fetchCategories(categorySearch);
      fetchStats();
      setMessage("Thêm danh mục thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Thêm danh mục thất bại");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await http.delete(`/admin/categories/${id}`);
      fetchCategories(categorySearch);
      fetchStats();
      setMessage("Xóa danh mục thành công");
    } catch (error) {
      setMessage(error.response?.data?.message || "Xóa danh mục thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Trang quản trị</h1>
          <p className="page-subtitle">
            Quản lý tài liệu, người dùng, khoa, môn học và danh mục.
          </p>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${tab === "stats" ? "active" : ""}`}
            onClick={() => setTab("stats")}
          >
            Thống kê
          </button>
          <button
            className={`tab-btn ${tab === "pending" ? "active" : ""}`}
            onClick={() => setTab("pending")}
          >
            Chờ duyệt
          </button>
          <button
            className={`tab-btn ${tab === "documents" ? "active" : ""}`}
            onClick={() => setTab("documents")}
          >
            Tài liệu
          </button>
          <button
            className={`tab-btn ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Người dùng
          </button>
          <button
            className={`tab-btn ${tab === "faculties" ? "active" : ""}`}
            onClick={() => setTab("faculties")}
          >
            Khoa
          </button>
          <button
            className={`tab-btn ${tab === "subjects" ? "active" : ""}`}
            onClick={() => setTab("subjects")}
          >
            Môn học
          </button>
          <button
            className={`tab-btn ${tab === "categories" ? "active" : ""}`}
            onClick={() => setTab("categories")}
          >
            Danh mục
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {tab === "stats" && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Người dùng</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Tài liệu</div>
              <div className="stat-value">{stats.totalDocuments}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Chờ duyệt</div>
              <div className="stat-value">{stats.totalPending}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Đã duyệt</div>
              <div className="stat-value">{stats.totalApproved}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Khoa</div>
              <div className="stat-value">{stats.totalFaculties}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Môn học</div>
              <div className="stat-value">{stats.totalSubjects}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Danh mục</div>
              <div className="stat-value">{stats.totalCategories}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Lượt tải</div>
              <div className="stat-value">{stats.totalDownloads}</div>
            </div>
          </div>
        )}

        {tab === "pending" && (
          <>
            <div className="toolbar">
              <input
                className="form-input"
                placeholder="Tìm tài liệu chờ duyệt..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => fetchPendingDocs(docSearch)}
              >
                Tìm kiếm
              </button>
            </div>

            <div className="grid">
              {pendingDocs.map((doc) => (
                <div key={doc._id} className="card doc-card">
                  <div className="doc-cover-wrap">
                    <img
                      src={
                        doc.coverImageUrl ||
                        "https://placehold.co/600x800/0f172a/e2e8f0?text=Tai+Lieu"
                      }
                      alt={doc.title}
                      className="doc-cover"
                    />
                  </div>

                  <div className="card-body">
                    <span className="badge">Chờ duyệt</span>
                    <h3>{doc.title}</h3>
                    <p className="doc-desc">{doc.description}</p>

                    <div className="meta-list">
                      <div className="meta-item">
                        <span className="meta-label">Người đăng:</span>{" "}
                        {doc.uploaderId?.fullName}
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Khoa:</span>{" "}
                        {doc.facultyId?.name}
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Môn học:</span>{" "}
                        {doc.subjectId?.subjectName}
                      </div>
                    </div>

                    <div className="admin-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApprove(doc._id)}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(doc._id)}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "documents" && (
          <>
            <div className="toolbar">
              <input
                className="form-input"
                placeholder="Tìm tài liệu..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => fetchAllDocs(docSearch)}
              >
                Tìm kiếm
              </button>
            </div>

            <div className="list-stack">
              {allDocs.map((doc) => (
                <div key={doc._id} className="card">
                  <div className="card-body">
                    {editingDocId === doc._id ? (
                      <div className="form">
                        <input
                          className="form-input"
                          value={editDocForm.title}
                          onChange={(e) =>
                            setEditDocForm({
                              ...editDocForm,
                              title: e.target.value,
                            })
                          }
                        />
                        <textarea
                          className="form-textarea"
                          value={editDocForm.description}
                          onChange={(e) =>
                            setEditDocForm({
                              ...editDocForm,
                              description: e.target.value,
                            })
                          }
                        />
                        <select
                          className="form-select"
                          value={editDocForm.status}
                          onChange={(e) =>
                            setEditDocForm({
                              ...editDocForm,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                        </select>

                        <div className="admin-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSaveEditDoc(doc._id)}
                          >
                            Lưu
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingDocId("")}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row-between">
                          <div>
                            <h3>{doc.title}</h3>
                            <p className="doc-desc">{doc.description}</p>
                          </div>
                          <span className="badge">{doc.status}</span>
                        </div>

                        <div className="meta-list">
                          <div className="meta-item">
                            <span className="meta-label">Người đăng:</span>{" "}
                            {doc.uploaderId?.fullName}
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Khoa:</span>{" "}
                            {doc.facultyId?.name}
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Môn học:</span>{" "}
                            {doc.subjectId?.subjectName}
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Danh mục:</span>{" "}
                            {doc.categoryId?.name}
                          </div>
                        </div>

                        <div className="admin-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleStartEditDoc(doc)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteDoc(doc._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <div className="toolbar">
              <input
                className="form-input"
                placeholder="Tìm người dùng..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => fetchUsers(userSearch)}
              >
                Tìm kiếm
              </button>
            </div>

            <div className="table-wrap card">
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Khoa/Bộ môn</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.faculty}</td>
                        <td>
                          <select
                            className="table-select"
                            value={user.role}
                            onChange={(e) =>
                              handleChangeRole(user._id, e.target.value)
                            }
                          >
                            <option value="student">student</option>
                            <option value="lecturer">lecturer</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "faculties" && (
          <div className="profile-layout">
            <div className="card">
              <div className="card-body">
                <h2 className="section-title">Thêm khoa</h2>

                <form className="form" onSubmit={handleCreateFaculty}>
                  <input
                    className="form-input"
                    placeholder="Tên khoa"
                    value={facultyForm.name}
                    onChange={(e) =>
                      setFacultyForm({ ...facultyForm, name: e.target.value })
                    }
                    required
                  />
                  <textarea
                    className="form-textarea"
                    placeholder="Mô tả"
                    value={facultyForm.description}
                    onChange={(e) =>
                      setFacultyForm({
                        ...facultyForm,
                        description: e.target.value,
                      })
                    }
                  />
                  <button className="btn btn-primary" type="submit">
                    Thêm khoa
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="toolbar">
                  <input
                    className="form-input"
                    placeholder="Tìm khoa..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchFaculties(facultySearch)}
                  >
                    Tìm kiếm
                  </button>
                </div>

                <div className="list-stack">
                  {faculties.map((faculty) => (
                    <div key={faculty._id} className="card inner-card">
                      <div className="card-body row-between">
                        <div>
                          <h3>{faculty.name}</h3>
                          <p className="page-subtitle">
                            {faculty.description || "Không có mô tả"}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteFaculty(faculty._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "subjects" && (
          <div className="profile-layout">
            <div className="card">
              <div className="card-body">
                <h2 className="section-title">Thêm môn học</h2>

                <form className="form" onSubmit={handleCreateSubject}>
                  <input
                    className="form-input"
                    placeholder="Mã môn học"
                    value={subjectForm.subjectCode}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        subjectCode: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    className="form-input"
                    placeholder="Tên môn học"
                    value={subjectForm.subjectName}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        subjectName: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    className="form-select"
                    value={subjectForm.facultyId}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        facultyId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Số tín chỉ"
                    value={subjectForm.credit}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        credit: e.target.value,
                      })
                    }
                  />
                  <button className="btn btn-primary" type="submit">
                    Thêm môn học
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="toolbar">
                  <input
                    className="form-input"
                    placeholder="Tìm môn học..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchSubjects(subjectSearch)}
                  >
                    Tìm kiếm
                  </button>
                </div>

                <div className="list-stack">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="card inner-card">
                      <div className="card-body row-between">
                        <div>
                          <h3>
                            {subject.subjectCode} - {subject.subjectName}
                          </h3>
                          <p className="page-subtitle">
                            Khoa: {subject.facultyId?.name} | Tín chỉ:{" "}
                            {subject.credit}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteSubject(subject._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "categories" && (
          <div className="profile-layout">
            <div className="card">
              <div className="card-body">
                <h2 className="section-title">Thêm danh mục</h2>

                <form className="form" onSubmit={handleCreateCategory}>
                  <input
                    className="form-input"
                    placeholder="Tên danh mục"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    required
                  />
                  <textarea
                    className="form-textarea"
                    placeholder="Mô tả"
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                  />
                  <button className="btn btn-primary" type="submit">
                    Thêm danh mục
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="toolbar">
                  <input
                    className="form-input"
                    placeholder="Tìm danh mục..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchCategories(categorySearch)}
                  >
                    Tìm kiếm
                  </button>
                </div>

                <div className="list-stack">
                  {categories.map((category) => (
                    <div key={category._id} className="card inner-card">
                      <div className="card-body row-between">
                        <div>
                          <h3>{category.name}</h3>
                          <p className="page-subtitle">
                            {category.description || "Không có mô tả"}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
