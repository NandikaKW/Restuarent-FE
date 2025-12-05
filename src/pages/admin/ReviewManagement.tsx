import React, { useEffect, useState } from "react";
import { adminReviewService } from "../../services/reviewService";
import type { Review } from "../../types/review";

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const statusParam = filter === "all" ? undefined : filter;
      const res = await adminReviewService.getAllReviews(page, limit, statusParam);
      const data = res.data;
      setReviews(data.reviews);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      alert("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await adminReviewService.updateReviewStatus(id, status);
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete review?")) return;
    try {
      await adminReviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Review Management</h1>

      <div className="flex gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Rating</th>
                  <th className="p-2">Comment</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-2">{r.userName || (typeof r.userId === "object" ? `${(r.userId as any).firstName || ""} ${(r.userId as any).lastName || ""}` : "User")}</td>
                    <td className="p-2">{ (r.menuItemSnapshot?.title) || (typeof r.menuItemId === "object" ? (r.menuItemId as any).title : "Item") }</td>
                    <td className="p-2 text-center">{r.rating}</td>
                    <td className="p-2">{r.comment?.slice(0, 80)}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                    <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-2 flex gap-2">
                      {r.status === "pending" && (
                        <>
                          <button onClick={() => handleStatus(r._id, "approved")} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                          <button onClick={() => handleStatus(r._id, "rejected")} className="px-2 py-1 bg-yellow-600 text-white rounded">Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-500">No reviews found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
            <div>Page {page} / {totalPages}</div>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewManagement;
