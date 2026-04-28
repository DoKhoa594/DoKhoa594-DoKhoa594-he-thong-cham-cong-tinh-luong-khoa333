import { useState } from "react";

const timesheetData = [
  {
    id: 1,
    name: "Nguyen Van A",
    code: "EMP001",
    project: "ERP System",
    date: "2026-04-22",
    checkIn: "08:00",
    checkOut: "17:30",
    worked: 8.5,
    break: 1,
    ot: 0.5,
    status: "Submitted",
    payroll: "Pending",
  },
  {
    id: 2,
    name: "Tran Thi B",
    code: "EMP002",
    project: "HRM Project",
    date: "2026-04-22",
    checkIn: "08:10",
    checkOut: "18:20",
    worked: 9,
    break: 1,
    ot: 1,
    status: "Approved",
    payroll: "Approved",
  },
  {
    id: 3,
    name: "Le Van C",
    code: "EMP003",
    project: "Mobile App",
    date: "2026-04-22",
    checkIn: "09:00",
    checkOut: "17:00",
    worked: 7,
    break: 1,
    ot: 0,
    status: "Review",
    payroll: "Pending",
  },
];

export default function AttendancePage() {
  const [search, setSearch] = useState("");

  const filtered = timesheetData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const badge = (s: string) => {
    if (s === "Approved") {
      return "bg-green-100 text-green-700";
    }
    if (s === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timesheet & Workforce Tracking</h1>

          <p className="text-gray-500 mt-2">
            Track work hours, monitor activity, approve timesheets for payroll
            and project management
          </p>
        </div>

        <div className="space-x-3">
          <button className="px-4 py-2 bg-white rounded-2xl shadow">
            Export Report
          </button>

          <button className="px-4 py-2 bg-black text-white rounded-2xl">
            Approve Payroll
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Employees Active" value="120" />
        <Card title="Worked Hours" value="842h" />
        <Card title="Overtime" value="27h" />
        <Card title="Attendance Rate" value="96%" />
        <Card title="Pending Approval" value="18" />
        <Card title="Payroll Amount" value="42,500,000" />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-3xl shadow flex gap-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="border rounded-xl px-4 py-2"
        />

        <select className="border rounded-xl px-4 py-2">
          <option>All Projects</option>
          <option>ERP System</option>
          <option>HRM Project</option>
        </select>

        <select className="border rounded-xl px-4 py-2">
          <option>Approval Status</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>

        <button className="px-4 py-2 bg-black text-white rounded-xl">
          Filter
        </button>
      </div>

      {/* TIMESHEET TABLE */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="p-5 border-b font-semibold">Employee Timesheets</div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Employee</th>
              <th>Project</th>
              <th>Start</th>
              <th>End</th>
              <th>Worked</th>
              <th>Break</th>
              <th>OT</th>
              <th>Status</th>
              <th>Payroll</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{item.name}</div>

                  <div className="text-sm text-gray-500">{item.code}</div>
                </td>

                <td>{item.project}</td>

                <td>{item.checkIn}</td>

                <td>{item.checkOut}</td>

                <td>{item.worked}h</td>

                <td>{item.break}h</td>

                <td>{item.ot}h</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${badge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${badge(item.payroll)}`}
                  >
                    {item.payroll}
                  </span>
                </td>

                <td className="space-x-2">
                  <button className="px-3 py-1 border rounded-xl">View</button>

                  <button className="px-3 py-1 border rounded-xl">
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIVITY TRACKING */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-5">Project Hours Tracking</h2>

          <Progress label="ERP System" value={76} />

          <Progress label="HRM Project" value={62} />

          <Progress label="Mobile App" value={48} />
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-5">Payroll Approval Queue</h2>

          <div className="space-y-4">
            <Item name="18 Pending Timesheets" />

            <Item name="7 Payroll Reviews" />

            <Item name="5 Overtime Requests" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-3xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Progress({ label, value }: any) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-black h-3 rounded-full"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function Item({ name }: any) {
  return <div className="border rounded-2xl p-4">{name}</div>;
}
