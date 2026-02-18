import { Layout, Header, Sidebar, Card } from "@/components/composition";

const mockUsers = [
  { id: 1, name: "Ravi Kumar", email: "ravi@example.com", role: "Developer", department: "Engineering", joinDate: "2024-01-15", avatar: "RK" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", role: "Designer", department: "Design", joinDate: "2024-02-20", avatar: "PS" },
  { id: 3, name: "Amit Patel", email: "amit@example.com", role: "Manager", department: "Operations", joinDate: "2023-11-10", avatar: "AP" },
];

export default async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = mockUsers.find(u => u.id === parseInt(id)) || mockUsers[0];

  return (
    <Layout Header={Header} Sidebar={Sidebar}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Viewing profile for user #{id}</p>
          </div>
          <a
            href="/home"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {user.avatar}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
              <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Active
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <a
                href={`/home/${id}/contact`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact User
              </a>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </div>
          </Card>

          <Card title="Profile Information" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <p className="text-gray-900 font-medium">{user.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                <p className="text-gray-900 font-medium">{user.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Join Date</label>
                <p className="text-gray-900 font-medium">{user.joinDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                <p className="text-gray-900 font-medium">#{id}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Recent Activity">
          <div className="space-y-4">
            {[
              { action: "Logged in", time: "2 hours ago" },
              { action: "Updated profile picture", time: "1 day ago" },
              { action: "Completed training module", time: "3 days ago" },
              { action: "Joined the team", time: user.joinDate },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <span className="text-gray-800">{activity.action}</span>
                <span className="text-sm text-gray-600">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}