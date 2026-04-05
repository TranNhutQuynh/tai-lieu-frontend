import { useEffect, useState } from "react";
import http from "../api/http";
import { getUser, updateStoredUser } from "../utils/auth";

export default function ProfilePage() {
  const currentUser = getUser();
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myDocs, setMyDocs] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingDocId, setEditingDocId] = useState("");

  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || "",
    faculty: currentUser?.faculty || "",
    avatar: null,
  });

  const [docForm, setDocForm] = useState({
    title: "",
    description: "",
    facultyId: "",
    subjectId: "",
    categoryId: "",
    file: null,
    coverImage: null,
  });

  const fetchMyDocs = async (q = "") => {
    const res = await http.get(
      `/profile/my-documents?q=${encodeURIComponent(q)}`
    );
    setMyDocs(res.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [facultiesRes, categoriesRes] = await Promise.all([
          http.get("/faculties"),
          http.get("/categories"),
        ]);
        setFaculties(facultiesRes.data);
        setCategories(categoriesRes.data);
        fetchMyDocs();
      } catch {
        setMessage("Không tải được dữ liệu hồ sơ");
      }
    };

    load();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!docForm.facultyId) {
          setSubjects([]);
          return;
        }

        const res = await http.get(`/subjects?facultyId=${docForm.facultyId}`);
        setSubjects(res.data);
      } catch {
        setMessage("Không tải được danh sách môn học");
      }
    };

    fetchSubjects();
  }, [docForm.facultyId]);

  const handleProfileChange = (e) => {
    if (e.target.name === "avatar") {
      setProfileForm({ ...profileForm, avatar: e.target.files[0] });
    } else {
      setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", profileForm.fullName);
      formData.append("faculty", profileForm.faculty);
      if (profileForm.avatar) formData.append("avatar", profileForm.avatar);

      const res = await http.put("/profile/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateStoredUser(res.data.user);
      setMessage(res.data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const handleStartEditDoc = async (doc) => {
    setEditingDocId(doc._id);
    setDocForm({
      title: doc.title || "",
      description: doc.description || "",
      facultyId: doc.facultyId?._id || "",
      subjectId: doc.subjectId?._id || "",
      categoryId: doc.categoryId?._id || "",
      file: null,
      coverImage: null,
    });

    if (doc.facultyId?._id) {
      try {
        const res = await http.get(`/subjects?facultyId=${doc.facultyId._id}`);
        setSubjects(res.data);
      } catch {
        setMessage("Không tải được môn học khi sửa tài liệu");
      }
    }
  };

  const handleDocChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" || name === "coverImage") {
      setDocForm({ ...docForm, [name]: files[0] });
      return;
    }

    if (name === "facultyId") {
      setDocForm({ ...docForm, facultyId: value, subjectId: "" });
      return;
    }

    setDocForm({ ...docForm, [name]: value });
  };

  const handleUpdateDoc = async (id) => {
    try {
      const formData = new FormData();
      formData.append("title", docForm.title);
      formData.append("description", docForm.description);
      formData.append("facultyId", docForm.facultyId);
      formData.append("subjectId", docForm.subjectId);
      formData.append("categoryId", docForm.categoryId);
      if (docForm.file) formData.append("file", docForm.file);
      if (docForm.coverImage) formData.append("coverImage", docForm.coverImage);

      const res = await http.put(`/profile/my-documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setEditingDocId("");
      fetchMyDocs(search);
    } catch (error) {
      setMessage(error.response?.data?.message || "Cập nhật tài liệu thất bại");
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    try {
      const res = await http.delete(`/profile/my-documents/${id}`);
      setMessage(res.data.message);
      fetchMyDocs(search);
    } catch (error) {
      setMessage(error.response?.data?.message || "Xóa tài liệu thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Hồ sơ cá nhân</h1>
          <p className="page-subtitle">
            Quản lý thông tin cá nhân và các tài liệu bạn đã tải lên.
          </p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        <div className="profile-layout">
          <div className="card">
            <div className="card-body">
              <h2 className="section-title">Thông tin cá nhân</h2>

              <div className="profile-header">
                <img
                  className="avatar-large"
                  src={
                    currentUser?.avatarUrl ||
                    "https://placehold.co/120x120?text=Avatar"
                  }
                  alt="avatar"
                />
                <div>
                  <h3>{currentUser?.fullName}</h3>
                  <p className="page-subtitle">@{currentUser?.username}</p>
                  <p className="page-subtitle">{currentUser?.email}</p>
                </div>
              </div>

              <form className="form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Họ tên</label>
                  <input
                    className="form-input"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Khoa / Bộ môn</label>
                  <input
                    className="form-input"
                    name="faculty"
                    value={profileForm.faculty}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar</label>
                  <input
                    className="form-input"
                    type="file"
                    name="avatar"
                    onChange={handleProfileChange}
                  />
                </div>

                <button className="btn btn-primary" type="submit">
                  Lưu hồ sơ
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row-between">
                <h2 className="section-title">Tài liệu đã tải lên</h2>
                <div className="toolbar compact">
                  <input
                    className="form-input"
                    placeholder="Tìm tài liệu của bạn..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchMyDocs(search)}
                  >
                    Tìm
                  </button>
                </div>
              </div>

              <div className="list-stack">
                {myDocs.map((doc) => (
                  <div key={doc._id} className="card inner-card">
                    <div className="card-body">
                      {editingDocId === doc._id ? (
                        <div className="form">
                          <input
                            className="form-input"
                            name="title"
                            value={docForm.title}
                            onChange={handleDocChange}
                          />
                          <textarea
                            className="form-textarea"
                            name="description"
                            value={docForm.description}
                            onChange={handleDocChange}
                          />

                          <select
                            className="form-select"
                            name="facultyId"
                            value={docForm.facultyId}
                            onChange={handleDocChange}
                          >
                            <option value="">-- Chọn khoa --</option>
                            {faculties.map((faculty) => (
                              <option key={faculty._id} value={faculty._id}>
                                {faculty.name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="form-select"
                            name="subjectId"
                            value={docForm.subjectId}
                            onChange={handleDocChange}
                            disabled={!docForm.facultyId}
                          >
                            <option value="">-- Chọn môn học --</option>
                            {subjects.map((subject) => (
                              <option key={subject._id} value={subject._id}>
                                {subject.subjectCode} - {subject.subjectName}
                              </option>
                            ))}
                          </select>

                          <select
                            className="form-select"
                            name="categoryId"
                            value={docForm.categoryId}
                            onChange={handleDocChange}
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>

                          <input
                            className="form-input"
                            type="file"
                            name="file"
                            onChange={handleDocChange}
                          />

                          <input
                            className="form-input"
                            type="file"
                            name="coverImage"
                            onChange={handleDocChange}
                          />

                          <div className="admin-actions">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleUpdateDoc(doc._id)}
                            >
                              Lưu thay đổi
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
                            <div className="meta-item">
                              <span className="meta-label">Lượt tải:</span>{" "}
                              {doc.downloadCount}
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

                {myDocs.length === 0 && (
                  <p className="page-subtitle">
                    Bạn chưa tải lên tài liệu nào.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
