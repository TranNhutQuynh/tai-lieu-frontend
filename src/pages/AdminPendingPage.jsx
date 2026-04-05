import { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminPendingPage() {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    try {
      const res = await http.get("/admin/documents/pending");
      setDocuments(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Không tải được tài liệu chờ duyệt"
      );
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await http.patch(`/admin/documents/${id}/approve`);
      fetchPending();
    } catch {
      setMessage("Phê duyệt thất bại");
    }
  };

  const handleReject = async (id) => {
    try {
      await http.patch(`/admin/documents/${id}/reject`);
      fetchPending();
    } catch {
      setMessage("Từ chối thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Tài liệu chờ duyệt</h1>
          <p className="page-subtitle">
            Quản trị viên kiểm tra và quyết định phê duyệt hoặc từ chối tài
            liệu.
          </p>
        </div>

        {message && <div className="alert alert-error">{message}</div>}

        {documents.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p className="page-subtitle">Không có tài liệu chờ duyệt.</p>
            </div>
          </div>
        ) : (
          <div className="grid">
            {documents.map((doc) => (
              <div key={doc._id} className="card doc-card">
                <div className="card-body">
                  <h3>{doc.title}</h3>
                  <p className="doc-desc">
                    {doc.description || "Chưa có mô tả."}
                  </p>

                  <div className="meta-list">
                    <div className="meta-item">
                      <span className="meta-label">Người đăng:</span>{" "}
                      {doc.uploaderId?.fullName}
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Môn:</span>{" "}
                      {doc.subjectId?.subjectName}
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Danh mục:</span>{" "}
                      {doc.categoryId?.name}
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
        )}
      </div>
    </div>
  );
}
