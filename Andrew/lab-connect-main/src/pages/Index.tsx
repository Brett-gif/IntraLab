import { useState } from 'react';
import { labMembers } from '@/data/labMembers';
import MemberCard from '@/components/MemberCard';
import MemberPanel from '@/components/MemberPanel';
import { LabMember } from '@/types/labMember';
import { Users, Beaker, Code2 } from 'lucide-react';

const Index = () => {
  const [selectedMember, setSelectedMember] = useState<LabMember | null>(null);
  const [filter, setFilter] = useState<'all' | 'wet' | 'dry'>('all');

  const filteredMembers = labMembers.filter((member) => {
    if (filter === 'all') return true;
    return member.labType === filter;
  });

  const wetCount = labMembers.filter((m) => m.labType === 'wet').length;
  const dryCount = labMembers.filter((m) => m.labType === 'dry').length;

  return (
    <div className="min-h-screen pattern-dna">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/50 to-transparent">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-primary mb-4">
              <Users className="h-4 w-4" />
              <span className="font-medium">Lab Directory</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Research Team
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Click on any team member to view their latest research updates, project details, and AI-translated explanations for both wet and dry lab audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              All ({labMembers.length})
            </button>
            <button
              onClick={() => setFilter('wet')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'wet'
                  ? 'bg-wet-lab text-wet-lab-foreground'
                  : 'bg-wet-lab-muted text-wet-lab hover:bg-wet-lab/20'
              }`}
            >
              <Beaker className="h-3.5 w-3.5" />
              Wet Lab ({wetCount})
            </button>
            <button
              onClick={() => setFilter('dry')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'dry'
                  ? 'bg-dry-lab text-dry-lab-foreground'
                  : 'bg-dry-lab-muted text-dry-lab hover:bg-dry-lab/20'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Dry Lab ({dryCount})
            </button>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MemberCard
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No team members found for this filter.</p>
          </div>
        )}
      </section>

      {/* Member Panel */}
      {selectedMember && (
        <MemberPanel
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default Index;
