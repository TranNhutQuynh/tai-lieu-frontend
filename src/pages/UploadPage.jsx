import { useEffect, useState } from "react";
import http from "../api/http";

export default function UploadPage() {
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    facultyId: "",
    subjectId: "",
    categoryId: "",
    file: null,
    coverImage: null,
  });

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [facultiesRes, categoriesRes] = await Promise.all([
          http.get("/faculties"),
          http.get("/categories"),
        ]);
        setFaculties(facultiesRes.data);
        setCategories(categoriesRes.data);
      } catch {
        setMessage("Không tải được danh sách khoa hoặc danh mục");
      }
    };

    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!form.facultyId) {
          setSubjects([]);
          setForm((prev) => ({ ...prev, subjectId: "" }));
          return;
        }

        const res = await http.get(`/subjects?facultyId=${form.facultyId}`);
        setSubjects(res.data);
        setForm((prev) => ({ ...prev, subjectId: "" }));
      } catch {
        setMessage("Không tải được danh sách môn học");
      }
    };

    fetchSubjects();
  }, [form.facultyId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" || name === "coverImage") {
      setForm({ ...form, [name]: files[0] });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("facultyId", form.facultyId);
      formData.append("subjectId", form.subjectId);
      formData.append("categoryId", form.categoryId);
      formData.append("file", form.file);

      if (form.coverImage) {
        formData.append("coverImage", form.coverImage);
      }

      const res = await http.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setForm({
        title: "",
        description: "",
        facultyId: "",
        subjectId: "",
        categoryId: "",
        file: null,
        coverImage: null,
      });
      setSubjects([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Tải lên thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-wrap">
          <div className="card form-card">
            <h2 className="form-title">Tải lên tài liệu</h2>
            <p className="form-subtitle">
              Chọn khoa trước, sau đó chọn môn học thuộc khoa đó và gửi tài liệu
              lên hệ thống.
            </p>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input
                  className="form-input"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Khoa</label>
                <select
                  className="form-select"
                  name="facultyId"
                  value={form.facultyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn khoa --</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Môn học</label>
                <select
                  className="form-select"
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  required
                  disabled={!form.facultyId}
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectCode} - {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">File tài liệu</label>
                <input
                  className="form-input"
                  name="file"
                  type="file"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ảnh bìa (tùy chọn)</label>
                <input
                  className="form-input"
                  name="coverImage"
                  type="file"
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Tải lên
              </button>
            </form>

            {message && (
              <div
                className={`alert ${
                  message.toLowerCase().includes("thất bại")
                    ? "alert-error"
                    : "alert-success"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
