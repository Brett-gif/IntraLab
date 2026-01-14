import { AIInsight } from '@/types/labMember';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Users, Rocket, AlertCircle, Calendar } from 'lucide-react';

interface InsightCardProps {
  insight: AIInsight;
}

const categoryConfig = {
  breakthrough: {
    icon: Rocket,
    label: 'Breakthrough',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  collaboration: {
    icon: Users,
    label: 'Collaboration',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  milestone: {
    icon: Lightbulb,
    label: 'Milestone',
    className: 'bg-dry-lab/10 text-dry-lab border-dry-lab/20',
  },
  challenge: {
    icon: AlertCircle,
    label: 'Challenge',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

const InsightCard = ({ insight }: InsightCardProps) => {
  const config = categoryConfig[insight.category];
  const Icon = config.icon;

  return (
    <article className="card-bio rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.className}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
              {insight.title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(insight.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {insight.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {insight.relatedMembers.map((member) => (
          <Badge key={member} variant="secondary" className="text-xs font-normal">
            {member}
          </Badge>
        ))}
      </div>
    </article>
  );
};

export default InsightCard;
