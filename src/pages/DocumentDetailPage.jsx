import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import { isLoggedIn } from "../utils/auth";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const fetchDetail = async () => {
    try {
      const res = await http.get(`/documents/${id}`);
      setDoc(res.data.document);
      setComments(res.data.comments);
    } catch {
      setMessage("Không tải được chi tiết tài liệu");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await http.get(`/documents/${id}/download`);
      window.open(res.data.fileUrl, "_blank");
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tải được tài liệu");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      await http.post(`/documents/${id}/comment-rating`, { comment, rating });
      setComment("");
      setRating(5);
      setMessage("Gửi đánh giá thành công");
      fetchDetail();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không gửi được đánh giá");
    }
  };

  if (!doc) {
    return (
      <div className="page">
        <div className="container">{message || "Đang tải..."}</div>
      </div>
    );
  }

  const cover =
    doc.coverImageUrl ||
    "https://placehold.co/600x800/0f172a/e2e8f0?text=Tai+Lieu";

  const canPreviewPdf = doc.fileType === "application/pdf" && doc.previewUrl;

  return (
    <div className="page">
      <div className="container">
        {/* Nút đóng / quay lại */}
        <button
          className="btn-close-detail"
          onClick={() => navigate(-1)}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="detail-layout">
          <div className="card">
            <div className="card-body">
              <div className="detail-hero">
                <img className="detail-cover" src={cover} alt={doc.title} />

                <div className="detail-main">
                  <span className="badge">
                    {doc.categoryId?.name || "Tài liệu"}
                  </span>
                  <h1 className="detail-title">{doc.title}</h1>
                  <p className="detail-desc">
                    {doc.description || "Chưa có mô tả."}
                  </p>

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
                      <span className="meta-label">Người đăng:</span>{" "}
                      {doc.uploaderId?.fullName}
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Lượt tải:</span>{" "}
                      {doc.downloadCount}
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={handleDownload}>
                    Tải về
                  </button>
                </div>
              </div>

              <div className="preview-section">
                <h3 className="section-title">Xem trước tài liệu</h3>

                {canPreviewPdf ? (
                  <iframe
                    title="preview-pdf"
                    src={doc.previewUrl}
                    className="pdf-preview"
                  />
                ) : (
                  <div className="alert alert-error">
                    Tính năng xem trước hiện hỗ trợ tốt nhất cho file PDF. Với
                    DOCX/PPTX, bạn có thể tải về để xem đầy đủ.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="section-title">Đánh giá & bình luận</h3>

              {isLoggedIn() && (
                <form className="form comment-box" onSubmit={handleComment}>
                  <div className="form-group">
                    <label className="form-label">Nội dung bình luận</label>
                    <textarea
                      className="form-textarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Viết nhận xét của bạn..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số sao</label>
                    <select
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value={5}>5 sao</option>
                      <option value={4}>4 sao</option>
                      <option value={3}>3 sao</option>
                      <option value={2}>2 sao</option>
                      <option value={1}>1 sao</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Gửi đánh giá
                  </button>
                </form>
              )}

              {message && <div className="alert alert-success">{message}</div>}

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="page-subtitle">Chưa có bình luận nào.</p>
                ) : (
                  comments.map((item) => (
                    <div key={item._id} className="comment-item">
                      <div className="comment-head">
                        <strong>
                          {item.userId?.fullName || item.userId?.username}
                        </strong>
                        <span>{item.rating}★</span>
                      </div>
                      <p>{item.comment || "Không có nội dung."}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
