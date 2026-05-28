import React, { useEffect, useState } from "react";
import { FaStar, FaChartBar, FaUsers } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { getAppRatingsApi, getAppRatingAverageApi } from "../../../api/admin.api";

const AverageRating = () => {
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
      console.log("Average rating fetch error:", error);
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

  const getRatingCount = (star) => {
    return ratings.filter((item) => Number(item?.rating) === star).length;
  };

  const ratingRows = [5, 4, 3, 2, 1].map((star) => {
    const count = getRatingCount(star);
    const percentage = totalRatings ? Math.round((count / totalRatings) * 100) : 0;

    return {
      star,
      count,
      percentage,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="mb-6 rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
          Rating Analytics
        </p>
        <h1 className="mt-3 text-3xl font-bold">Average Rating</h1>
        <p className="mt-2 text-sm text-slate-300">
          Analyze overall customer satisfaction and star distribution.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          Loading average rating...
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-[#07100b] p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
                  <FaStar className="text-3xl" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Average Rating</p>
                  <h2 className="text-4xl font-bold">
                    {Number(averageRating || 0).toFixed(1)}
                    <span className="text-lg text-slate-400"> / 5</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#07100b] p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                  <FaUsers className="text-3xl" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Total Ratings</p>
                  <h2 className="text-4xl font-bold">{totalRatings}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#07100b] p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <FaChartBar className="text-orange-400" />
              <h2 className="text-xl font-bold">Rating Distribution</h2>
            </div>

            <div className="space-y-4">
              {ratingRows.map((row) => (
                <div key={row.star} className="flex items-center gap-4">
                  <div className="flex w-16 items-center gap-1 text-sm font-bold">
                    {row.star}
                    <FaStar className="text-yellow-400" />
                  </div>

                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>

                  <div className="w-20 text-right text-sm text-slate-300">
                    {row.count} ({row.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AverageRating;