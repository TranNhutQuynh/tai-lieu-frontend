import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import DocumentCard from "../components/DocumentCard";

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (facultyId) params.append("facultyId", facultyId);
      if (subjectId) params.append("subjectId", subjectId);
      if (categoryId) params.append("categoryId", categoryId);

      const res = await http.get(`/documents?${params.toString()}`);
      setDocuments(res.data);
    } catch {
      setMessage("Không tải được danh sách tài liệu");
    }
  };

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
        setMessage("Không tải được dữ liệu khoa hoặc danh mục");
      }
    };

    fetchBaseData();
    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!facultyId) {
          setSubjects([]);
          setSubjectId("");
          return;
        }

        const res = await http.get(`/subjects?facultyId=${facultyId}`);
        setSubjects(res.data);
        setSubjectId("");
      } catch {
        setMessage("Không tải được môn học");
      }
    };

    fetchSubjects();
  }, [facultyId]);

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <h1 className="page-title">
            Kho tài liệu học tập hiện đại cho sinh viên
          </h1>
          <p className="page-subtitle">
            Tìm kiếm giáo trình, bài giảng, đề cương và tài liệu tham khảo theo
            khoa, môn học và danh mục.
          </p>

          <div className="hero-actions">
            <Link to="/upload" className="btn btn-primary">
              Tải lên tài liệu
            </Link>
            <a href="#documents" className="btn btn-secondary">
              Khám phá tài liệu
            </a>
          </div>

          <div className="search-panel">
            <div className="search-grid">
              <input
                className="form-input"
                placeholder="Tìm theo tên tài liệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
              >
                <option value="">Tất cả khoa</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!facultyId}
              >
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectCode} - {subject.subjectName}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button className="btn btn-primary" onClick={fetchDocuments}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        <section id="documents">
          <div className="section-header">
            <h2 className="section-title">Danh sách tài liệu</h2>
            <p className="page-subtitle">
              Xem trước tài liệu trước khi quyết định tải về.
            </p>
          </div>

          {message && <div className="alert alert-error">{message}</div>}

          {documents.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <p className="page-subtitle">Chưa có tài liệu phù hợp.</p>
              </div>
            </div>
          ) : (
            <div className="grid">
              {documents.map((doc) => (
                <DocumentCard key={doc._id} doc={doc} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
