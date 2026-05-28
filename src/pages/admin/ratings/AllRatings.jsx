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
        className={index < Number(count) ? "text-yellow-400" : "text-gray-600"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="mb-6 rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
          Rating Management
        </p>
        <h1 className="mt-3 text-3xl font-bold">All Ratings</h1>
        <p className="mt-2 text-sm text-slate-300">
          View all user ratings and reviews submitted from the app.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07100b] shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="p-4 text-sm font-semibold text-gray-400">User</th>
              <th className="p-4 text-sm font-semibold text-gray-400">Rating</th>
              <th className="p-4 text-sm font-semibold text-gray-400">Review</th>
              <th className="p-4 text-sm font-semibold text-gray-400">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Loading ratings...
                </td>
              </tr>
            ) : ratings.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No ratings found
                </td>
              </tr>
            ) : (
              ratings.map((item) => (
                <tr
                  key={item?._id}
                  className="border-b border-white/5 transition hover:bg-white/[0.04]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                        <FaUserCircle className="text-2xl" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {item?.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item?.user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {renderStars(item?.rating)}
                      <span className="ml-2 text-sm text-gray-300">
                        {item?.rating || 0}/5
                      </span>
                    </div>
                  </td>

                  <td className="max-w-md p-4 text-sm text-gray-300">
                    {item?.review || "No review added"}
                  </td>

                  <td className="p-4 text-sm text-gray-400">
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRatings;