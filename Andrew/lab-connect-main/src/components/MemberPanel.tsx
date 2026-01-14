import { useEffect, useState, FormEvent } from 'react';
import { submitUpdate, fetchDashboard } from '@/lib/api';
import { LabMember } from '@/types/labMember';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Beaker, Code2, FileText, Sparkles, Calendar, History, X } from 'lucide-react';


interface MemberPanelProps {
  member: LabMember;
  onClose: () => void;
}

const MemberPanel = ({ member, onClose }: MemberPanelProps) => {
  const [showDryLab, setShowDryLab] = useState(member.labType === 'dry');
  const [updateText, setUpdateText] = useState('');
  const [updateType, setUpdateType] = useState<'wet' | 'dry'>(member.labType === 'dry' ? 'dry' : 'wet');
  const [submitStatus, setSubmitStatus] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard on mount to get live explanations from JSON
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchDashboard(member.id);
        setDashboard(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      }
    }; 
    loadDashboard();
  }, [member.id]);

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const isWet = member.labType === 'wet';

  // Get explanations from dashboard JSON

  const wetUpdates = dashboard?.wet_updates || {};
  const dryUpdates = dashboard?.dry_updates || {};
  const currentExplanation = showDryLab 
    ? (dryUpdates.latest?.summary || 'Explanation pending...')
    : (wetUpdates.latest?.summary || 'Explanation pending...');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    setSubmitStatus('Sending...');
    try {
      const userId = member.id;
      await submitUpdate(String(userId), { text: updateText, update_type: updateType });
      
      // Refresh dashboard to get latest explanation
      const updatedData = await fetchDashboard(userId);
      setDashboard(updatedData);
      
      setSubmitStatus('Sent!');
      setUpdateText('');
    } catch (err) {
      console.error(err);
      setSubmitStatus('Error sending update');
    }
  };

  if (loading) return <div>Loading...</div>;

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
          {/* ...existing header code... */}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* ...existing sections... */}

          {/* Explanation Toggle - now reading from dashboard JSON */}
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
                {currentExplanation}
              </p>
            </div>
          </section>

          {/* ...rest of existing code... */}
        </div>
      </div>
    </>
  );
};

export default MemberPanel;