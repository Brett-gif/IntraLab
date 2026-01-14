import { useState } from 'react';
import { LabMember } from '@/types/labMember';
import MemberPanel from './MemberPanel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Beaker, Code2 } from 'lucide-react';

interface MemberCardProps {
  member: LabMember;
}

const MemberCard = ({ member }: MemberCardProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const isWet = member.labType === 'wet';

  return (
    <>
      <Card
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsPanelOpen(true)}
      >
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-serif text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <Badge variant="secondary" className={`gap-1 ${isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}`}>
          {isWet ? <Beaker className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
          {isWet ? 'Wet Lab' : 'Dry Lab'}
        </Badge>
      </Card>

      {isPanelOpen && (
        <MemberPanel
          member={member}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </>
  );
};

export default MemberCard;