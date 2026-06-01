import React, { useEffect, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showError } from "../../../utils/alertService";
import { getAppRatingsApi } from "../../../api/admin.api";

const AllRatings = () => {
  const dispatch = useDispatch();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArrayData = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.ratings)) return res.data.ratings;
    if (Array.isArray(res?.ratings)) return res.ratings;
    return [];
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      dispatch(showLoader());

      const response = await getAppRatingsApi();
      console.log("APP RATINGS RESPONSE 👉", response);

      if (response?.success) {
        setRatings(getArrayData(response));
      } else {
        setRatings([]);
        showError(response?.message || "Failed to fetch ratings");
      }
    } catch (error) {
      console.log("Ratings fetch error:", error);
      showError("Something went wrong while fetching ratings");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={index < Number(count) ? "text-yellow-400" : "text-slate-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-4 md:p-6 text-[var(--text-primary)]">
      {/* Header Card */}
      <div className="card-3d p-6 mb-6 bg-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
          Rating Management
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-800">All Ratings</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
          View all user ratings and reviews submitted from the app.
        </p>
      </div>

      {/* Table Card */}
      <div className="card-3d overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-5 pl-8">User</th>
                <th className="p-5">Rating</th>
                <th className="p-5">Review</th>
                <th className="p-5">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-semibold">
                    Loading ratings...
                  </td>
                </tr>
              ) : ratings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-semibold">
                    No ratings found
                  </td>
                </tr>
              ) : (
                ratings.map((item) => (
                  <tr
                    key={item?._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
                          <FaUserCircle className="text-xl" />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {item?.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item?.user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(item?.rating)}
                        </div>
                        <span className="ml-2 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item?.rating || 0}/5
                        </span>
                      </div>
                    </td>

                    <td className="max-w-md p-5 text-sm text-slate-600 font-medium">
                      {item?.review || <span className="text-slate-400 italic">No review added</span>}
                    </td>

                    <td className="p-5 text-xs text-slate-400 font-semibold">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllRatings;