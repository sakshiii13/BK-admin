import React, { useEffect, useState } from "react";
import { FaStar, FaUsers, FaRegSmile, FaChartLine } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { getAppRatingsApi, getAppRatingAverageApi } from "../../../api/admin.api";

const Ratings = () => {
  const dispatch = useDispatch();
  const [ratings, setRatings] = useState([]);
  const [averageData, setAverageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getArrayData = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.ratings)) return res.data.ratings;
    if (Array.isArray(res?.ratings)) return res.ratings;
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      dispatch(showLoader());

      const ratingRes = await getAppRatingsApi();
      const averageRes = await getAppRatingAverageApi();

      setRatings(getArrayData(ratingRes));
      setAverageData(averageRes?.data || averageRes || null);
    } catch (error) {
      console.log("Ratings fetch error:", error);
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRatings =
    averageData?.totalRatings || averageData?.total || ratings.length || 0;

  const averageRating =
    averageData?.averageRating || averageData?.average || averageData?.rating || 0;

  const positiveReviews = ratings.filter((item) => Number(item?.rating) >= 4).length;

  const latestReviews = ratings.slice(0, 5);

  const cardClass =
    "rounded-[28px] border border-white/10 bg-[#07100b] p-5 shadow-xl";

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="mb-6 rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
          Rating Management
        </p>
        <h1 className="mt-3 text-3xl font-bold">Ratings Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Quick overview of app ratings, customer reviews and feedback.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading ratings...</div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className={cardClass}>
              <FaStar className="text-3xl text-yellow-400" />
              <p className="mt-4 text-sm text-slate-400">Average Rating</p>
              <h2 className="mt-1 text-3xl font-bold">
                {Number(averageRating || 0).toFixed(1)}
              </h2>
            </div>

            <div className={cardClass}>
              <FaUsers className="text-3xl text-orange-400" />
              <p className="mt-4 text-sm text-slate-400">Total Reviews</p>
              <h2 className="mt-1 text-3xl font-bold">{totalRatings}</h2>
            </div>

            <div className={cardClass}>
              <FaRegSmile className="text-3xl text-green-400" />
              <p className="mt-4 text-sm text-slate-400">Positive Reviews</p>
              <h2 className="mt-1 text-3xl font-bold">{positiveReviews}</h2>
            </div>

            <div className={cardClass}>
              <FaChartLine className="text-3xl text-blue-400" />
              <p className="mt-4 text-sm text-slate-400">Satisfaction</p>
              <h2 className="mt-1 text-3xl font-bold">
                {totalRatings
                  ? Math.round((positiveReviews / totalRatings) * 100)
                  : 0}
                %
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#07100b] p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Latest Reviews</h2>

            {latestReviews.length === 0 ? (
              <p className="py-6 text-center text-slate-400">No ratings found</p>
            ) : (
              <div className="space-y-3">
                {latestReviews.map((item) => (
                  <div
                    key={item?._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {item?.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item?.user?.email || "No email"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar />
                        <span className="text-sm text-white">
                          {item?.rating || 0}/5
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-300">
                      {item?.review || "No review added"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Ratings;