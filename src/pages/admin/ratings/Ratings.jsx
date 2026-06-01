import React, { useEffect, useState } from "react";
import { FaStar, FaUsers, FaRegSmile, FaChartLine, FaChartBar } from "react-icons/fa";
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

  const ratingRows = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((item) => Number(item?.rating) === star).length;
    const percentage = totalRatings ? Math.round((count / totalRatings) * 100) : 0;

    return {
      star,
      count,
      percentage,
    };
  });

  const cardClass =
    "rounded-[28px] border border-white/10 bg-[#07100b] p-5 shadow-xl";

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-500">
            Rating Management
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-900">Ratings Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Quick overview of app ratings, customer reviews and feedback so you can monitor satisfaction and star distribution at a glance.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-xl">
            Loading ratings...
          </div>
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-4 lg:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-600">
                    <FaStar className="text-2xl" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Average</span>
                </div>
                <div className="mt-6">
                  <h2 className="text-5xl font-bold text-slate-900">{Number(averageRating || 0).toFixed(1)}</h2>
                  <p className="mt-2 text-sm text-slate-500">out of 5</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-100 text-orange-600">
                    <FaUsers className="text-2xl" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Total reviews</span>
                </div>
                <div className="mt-6">
                  <h2 className="text-5xl font-bold text-slate-900">{totalRatings}</h2>
                  <p className="mt-2 text-sm text-slate-500">customer ratings received</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
                    <FaRegSmile className="text-2xl" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Positive</span>
                </div>
                <div className="mt-6">
                  <h2 className="text-5xl font-bold text-slate-900">{positiveReviews}</h2>
                  <p className="mt-2 text-sm text-slate-500">reviews with 4 stars or more</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Satisfaction</span>
                </div>
                <div className="mt-6">
                  <h2 className="text-5xl font-bold text-slate-900">
                    {totalRatings
                      ? Math.round((positiveReviews / totalRatings) * 100)
                      : 0}
                    %
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">positive feedback ratio</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.85fr]">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <FaChartBar className="text-xl text-orange-500" />
                  <h2 className="text-xl font-bold text-slate-900">Rating Distribution</h2>
                </div>

                <div className="space-y-4">
                  {ratingRows.map((row) => (
                    <div key={row.star} className="grid grid-cols-[80px_minmax(0,1fr)_90px] items-center gap-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span>{row.star}</span>
                        <FaStar className="text-yellow-400" />
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        {row.count} • {row.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-slate-900">Latest Reviews</h2>
                {latestReviews.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    No ratings found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestReviews.map((item) => {
                      const userName = item?.user
                        ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
                        : "Unknown User";

                      return (
                        <div key={item?._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{userName}</p>
                              <p className="text-sm text-slate-500">{item?.user?.email || "No email"}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                              {item?.rating || 0}/5
                            </div>
                          </div>
                          <p className="mt-4 text-sm leading-6 text-slate-600">{item?.review || "No review added"}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Ratings;