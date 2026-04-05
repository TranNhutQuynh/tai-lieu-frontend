import { Link } from "react-router-dom";

export default function DocumentCard({ doc }) {
  const cover =
    doc.coverImageUrl ||
    "https://placehold.co/600x800/0f172a/e2e8f0?text=Tai+Lieu";

  return (
    <div className="card doc-card">
      <div className="doc-cover-wrap">
        <img src={cover} alt={doc.title} className="doc-cover" />
      </div>

      <div className="card-body">
        <span className="badge">{doc.categoryId?.name || "Tài liệu"}</span>
        <h3>{doc.title}</h3>
        <p className="doc-desc">{doc.description || "Chưa có mô tả."}</p>

        <div className="meta-list">
          <div className="meta-item">
            <span className="meta-label">Khoa:</span>{" "}
            {doc.facultyId?.name || "Chưa rõ"}
          </div>
          <div className="meta-item">
            <span className="meta-label">Môn học:</span>{" "}
            {doc.subjectId?.subjectName || "Chưa rõ"}
          </div>
          <div className="meta-item">
            <span className="meta-label">Lượt tải:</span>{" "}
            {doc.downloadCount || 0}
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/documents/${doc._id}`} className="btn btn-primary">
            Xem trước
          </Link>
        </div>
      </div>
    </div>
  );
}
