import { useMemo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Filter,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../api/axios";
import useDynamicTitle from "../hooks/useDynamicTitle";
import { useAuth } from "../auth/AuthContext";
import AccessDenied from "./components/AccessDenied";
import HerbalPageLoader from "../components/ui/HerbalPageLoader";

const DUMMY_REVENUE = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

const DUMMY_ORDERS = [
  { day: "Mon", orders: 24 },
  { day: "Tue", orders: 13 },
  { day: "Wed", orders: 98 },
  { day: "Thu", orders: 39 },
  { day: "Fri", orders: 48 },
  { day: "Sat", orders: 38 },
  { day: "Sun", orders: 43 },
];

const darkChart = {
  foreColor: "#94a3b8",
  toolbar: { show: false },
  zoom: { enabled: false },
  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
};

function sparklineOptions(lineColor = "#ffffff") {
  return {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 800 },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2, colors: [lineColor] },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    colors: [lineColor],
    tooltip: { enabled: false },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    dataLabels: { enabled: false },
  };
}

export default function Dashboard() {
  useDynamicTitle("Dashboard");
  const { can } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [revenueData, setRevenueData] = useState(DUMMY_REVENUE);
  const [orderData, setOrderData] = useState(DUMMY_ORDERS);

  const fetchDashboard = async (start = "", end = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/admin-dashboard/stats", {
        params: {
          start_date: start,
          end_date: end,
        },
      });

      if (res.data?.status) {
        const data = res.data.data;

        setStats({
          customers: data.customers,
          products: data.products,
          orders: data.orders,
          revenue: parseFloat(data.revenue),
        });

        const formattedRevenue =
          data.revenue_chart && data.revenue_chart.length > 0
            ? data.revenue_chart.map((item) => ({
                month: item.month,
                revenue: parseFloat(item.revenue),
              }))
            : DUMMY_REVENUE;

        setRevenueData(formattedRevenue);

        const formattedOrders =
          data.orders_chart && data.orders_chart.length > 0
            ? data.orders_chart
            : DUMMY_ORDERS;

        setOrderData(formattedOrders);
      } else {
        setError("Failed to load dashboard data");
        setRevenueData(DUMMY_REVENUE);
        setOrderData(DUMMY_ORDERS);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
      setRevenueData(DUMMY_REVENUE);
      setOrderData(DUMMY_ORDERS);
    } finally {
      setLoading(false);
      setReady(true);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const sparkSeries = useMemo(() => {
    const pts = revenueData.map((r) => r.revenue);
    if (pts.length < 2) return [{ data: [0, 1, 2, 3, 4, 3, 5, 4] }];
    return [{ data: pts.slice(-12) }];
  }, [revenueData]);

  const { categories, salesSeries, visitsSeries } = useMemo(() => {
    const cats = revenueData.map((r) => String(r.month));
    const sales = revenueData.map((r) => r.revenue);
    const visits = revenueData.map((_, i) => {
      const o = orderData[i % Math.max(orderData.length, 1)];
      const v = o?.orders ?? o?.value ?? 0;
      return typeof v === "number" ? v : Number(v) || 0;
    });
    return { categories: cats, salesSeries: sales, visitsSeries: visits };
  }, [revenueData, orderData]);

  const statsBars = useMemo(() => {
    const slice = revenueData.slice(-6);
    return {
      cats: slice.map((r) => String(r.month)),
      vals: slice.map((r) => r.revenue),
    };
  }, [revenueData]);

  const tableRows = useMemo(
    () => [
      {
        key: "customers",
        icon: Users,
        name: "Customers",
        qty: stats.customers,
        status: "Active",
        amount: "—",
      },
      {
        key: "products",
        icon: Package,
        name: "Products",
        qty: stats.products,
        status: "Active",
        amount: "—",
      },
      {
        key: "orders",
        icon: ShoppingCart,
        name: "Orders",
        qty: stats.orders,
        status: "Active",
        amount: "—",
      },
      {
        key: "revenue",
        icon: Wallet,
        name: "Revenue",
        qty: "—",
        status: "Active",
        amount: `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`,
      },
    ],
    [stats],
  );

  const areaOptions = useMemo(
    () => ({
      chart: {
        ...darkChart,
        type: "area",
        height: 360,
        stacked: false,
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { categories, labels: { style: { colors: "#94a3b8" } } },
      yaxis: {
        labels: { style: { colors: "#94a3b8" } },
        min: 0,
      },
      grid: {
        borderColor: "rgba(148,163,184,0.12)",
        strokeDashArray: 4,
      },
      legend: {
        labels: { colors: "#e2e8f0" },
        position: "top",
        horizontalAlign: "right",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      colors: ["#a855f7", "#14b8a6"],
      theme: { mode: "dark" },
      tooltip: {
        theme: "dark",
        y: {
          formatter(val) {
            return typeof val === "number" ? val.toLocaleString("en-IN") : val;
          },
        },
      },
    }),
    [categories],
  );

  const areaSeries = useMemo(
    () => [
      { name: "Sales", data: salesSeries },
      { name: "Visits", data: visitsSeries },
    ],
    [salesSeries, visitsSeries],
  );

  const barOptions = useMemo(
    () => ({
      chart: { ...darkChart, type: "bar", height: 280 },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "38%",
          distributed: false,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: statsBars.cats,
        labels: { style: { colors: "#94a3b8" } },
      },
      yaxis: { labels: { style: { colors: "#94a3b8" } } },
      grid: { borderColor: "rgba(148,163,184,0.1)" },
      colors: ["#a78bfa"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.45,
          opacityFrom: 1,
          opacityTo: 0.72,
          stops: [0, 100],
        },
      },
      theme: { mode: "dark" },
      tooltip: { theme: "dark" },
    }),
    [statsBars.cats],
  );

  const barSeries = useMemo(
    () => [{ name: "Sales", data: statsBars.vals }],
    [statsBars.vals],
  );

  if (!can("dashboard.view")) {
    return <AccessDenied />;
  }

  if (!ready) {
    return <HerbalPageLoader message="Loading dashboard…" />;
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] p-4 text-slate-100 md:p-6">
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded-lg p-1 text-red-200 hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[#12151c] p-4 shadow-xl shadow-black/30 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Same insights from your store — refreshed layout.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl bg-[#1a1f2a] px-3 py-2 text-sm text-white shadow-inner outline-none ring-0 focus:ring-2 focus:ring-violet-500/50 sm:w-auto"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              End date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl bg-[#1a1f2a] px-3 py-2 text-sm text-white shadow-inner outline-none focus:ring-2 focus:ring-violet-500/50 sm:w-auto"
            />
          </div>
          <button
            type="button"
            onClick={() => fetchDashboard(startDate, endDate)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Filter className="h-4 w-4" />
            {loading ? "Applying…" : "Apply filter"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GradientStatCard
          title="Customers"
          value={stats.customers.toLocaleString("en-IN")}
          icon={Users}
          gradient="from-violet-600 via-purple-700 to-indigo-900"
          spark={sparkSeries}
        />
        <GradientStatCard
          title="Products"
          value={stats.products.toLocaleString("en-IN")}
          icon={Package}
          gradient="from-rose-600 via-red-600 to-orange-700"
          spark={sparkSeries}
        />
        <GradientStatCard
          title="Orders"
          value={stats.orders.toLocaleString("en-IN")}
          icon={ShoppingCart}
          gradient="from-sky-600 via-blue-600 to-teal-700"
          spark={sparkSeries}
        />
        <GradientStatCard
          title="Revenue"
          value={`₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`}
          icon={Wallet}
          gradient="from-fuchsia-600 via-purple-600 to-violet-900"
          spark={sparkSeries}
        />
      </div>

      <div className="mb-6 rounded-2xl bg-[#12151c] p-4 shadow-xl shadow-black/30 md:p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-wide text-white">
          PRODUCTS SALES
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          Revenue vs orders trend (from your stats API)
        </p>
        <div className="min-h-[320px]">
          <ReactApexChart
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={360}
            width="100%"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl bg-[#12151c] p-4 shadow-xl shadow-black/30 md:p-6 lg:col-span-4">
          <h2 className="text-lg font-semibold text-white">Statistics</h2>
          <p className="mb-4 text-xs text-slate-500">Last months revenue</p>
          <ReactApexChart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={280}
            width="100%"
          />
        </div>

        <div className="rounded-2xl bg-[#12151c] p-4 shadow-xl shadow-black/30 md:p-6 lg:col-span-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Store metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-3 font-medium"> </th>
                  <th className="pb-3 pr-3 font-medium">Product</th>
                  <th className="pb-3 pr-3 font-medium">Quantity</th>
                  <th className="pb-3 pr-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tableRows.map((row) => (
                  <tr key={row.key} className="text-slate-200">
                    <td className="py-3 pr-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-violet-300">
                        <row.icon className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-medium text-white">{row.name}</td>
                    <td className="py-3 pr-3 text-slate-400">{row.qty}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          row.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : row.status === "Paused"
                              ? "bg-sky-500/20 text-sky-300"
                              : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradientStatCard({ title, value, icon: Icon, gradient, spark }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg shadow-black/40`}
    >
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {value}
          </p>
        </div>
        <div className="rounded-xl bg-white/10 p-2 text-white/90 backdrop-blur-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="relative z-10 mt-4 h-[52px] w-full opacity-95">
        <ReactApexChart
          options={sparklineOptions("#ffffff")}
          series={spark}
          type="area"
          height={52}
          width="100%"
        />
      </div>
    </div>
  );
}
