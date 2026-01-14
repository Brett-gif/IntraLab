import { LabMember } from '@/types/labMember';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Beaker, Code2, Calendar } from 'lucide-react';

interface MemberCardProps {
  member: LabMember;
  onClick: () => void;
}

const MemberCard = ({ member, onClick }: MemberCardProps) => {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const isWet = member.labType === 'wet';

  return (
    <button
      onClick={onClick}
      className="card-bio w-full rounded-xl border border-border p-6 text-left transition-all hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarFallback className={`font-medium ${isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground truncate">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            <Badge 
              variant="secondary" 
              className={`shrink-0 gap-1 ${isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}`}
            >
              {isWet ? <Beaker className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
              {isWet ? 'Wet Lab' : 'Dry Lab'}
            </Badge>
          </div>
          
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {member.projectDescription}
          </p>
          
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {new Date(member.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default MemberCard;
