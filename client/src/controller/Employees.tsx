export default function Employees() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <button className="bg-blue-500 text-white px-4 py-2 mb-4">
        Add Employee
      </button>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
