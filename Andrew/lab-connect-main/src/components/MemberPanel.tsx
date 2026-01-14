import { useState } from 'react';
import { LabMember } from '@/types/labMember';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Beaker, Code2, Calendar, FileText, History, Sparkles } from 'lucide-react';

interface MemberPanelProps {
  member: LabMember;
  onClose: () => void;
}

const MemberPanel = ({ member, onClose }: MemberPanelProps) => {
  const [showDryLab, setShowDryLab] = useState(member.labType === 'dry');

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const isWet = member.labType === 'wet';
  const currentExplanation = showDryLab ? member.dryLabExplanation : member.wetLabExplanation;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-card shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className={`text-lg font-medium ${isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {member.name}
                </h2>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <Badge 
                  variant="secondary" 
                  className={`mt-2 gap-1 ${isWet ? 'bg-wet-lab-muted text-wet-lab' : 'bg-dry-lab-muted text-dry-lab'}`}
                >
                  {isWet ? <Beaker className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
                  {isWet ? 'Wet Lab' : 'Dry Lab'}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Description */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-lg font-medium text-foreground">Project</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {member.projectDescription}
            </p>
          </section>

          <Separator />

          {/* Recent Update */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-serif text-lg font-medium text-foreground">Recent Update</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(member.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 border border-border p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {member.recentUpdate}
              </p>
            </div>
          </section>

          {/* Explanation Toggle */}
          <section className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {showDryLab ? (
                  <Code2 className="h-4 w-4 text-dry-lab" />
                ) : (
                  <Beaker className="h-4 w-4 text-wet-lab" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {showDryLab ? 'Dry Lab' : 'Wet Lab'} Explanation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="lab-toggle" className={`text-xs ${!showDryLab ? 'text-wet-lab font-medium' : 'text-muted-foreground'}`}>
                  Wet
                </Label>
                <Switch
                  id="lab-toggle"
                  checked={showDryLab}
                  onCheckedChange={setShowDryLab}
                  className="data-[state=checked]:bg-dry-lab data-[state=unchecked]:bg-wet-lab"
                />
                <Label htmlFor="lab-toggle" className={`text-xs ${showDryLab ? 'text-dry-lab font-medium' : 'text-muted-foreground'}`}>
                  Dry
                </Label>
              </div>
            </div>
            <div className={`rounded-lg p-4 transition-colors ${showDryLab ? 'bg-dry-lab-muted' : 'bg-wet-lab-muted'}`}>
              <p className="text-sm text-foreground leading-relaxed">
                {currentExplanation || 'Explanation being generated...'}
              </p>
            </div>
          </section>

          <Separator />

          {/* Previous Update */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-serif text-lg font-medium text-foreground">Previous Update</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {member.previousUpdate}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default MemberPanel;
