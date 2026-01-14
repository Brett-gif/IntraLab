import { useEffect, useState } from 'react';
import { fetchAllUsers, fetchDashboard } from '@/lib/api';
import { LabMember } from '@/types/labMember';
import MemberCard from '@/components/MemberCard';

export default function Index() {
  const [members, setMembers] = useState<LabMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const { users } = await fetchAllUsers();
        const memberDashboards = await Promise.all(
          users.map(user => fetchDashboard(user.user_id))
        );

        const membersData: LabMember[] = users.map((user, idx) => {
          const dash = memberDashboards[idx];
          const projectDesc = dash.project_descriptions || {};
          const wetUpdates = dash.wet_updates || {};
          const dryUpdates = dash.dry_updates || {};

          return {
            id: user.user_id,
            name: user.name,
            role: user.role,
            labType: 'wet',
            projectDescription: projectDesc.description || projectDesc.Name || 'No project description',
            recentUpdate: wetUpdates.latest?.summary || 'No recent updates',
            previousUpdate: 'Previous update placeholder',
            wetLabExplanation: wetUpdates.latest?.summary || 'No wet lab explanation yet',
            dryLabExplanation: dryUpdates.latest?.summary || 'No dry lab explanation yet',
            lastUpdated: wetUpdates.latest?.date || new Date().toISOString(),
          };
        });

        setMembers(membersData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load members');
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Lab Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}