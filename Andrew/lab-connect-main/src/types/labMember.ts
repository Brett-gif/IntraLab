export type LabType = 'wet' | 'dry';

export interface LabMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  labType: LabType;
  projectDescription: string;
  previousUpdate: string;
  recentUpdate: string;
  wetLabExplanation?: string;
  dryLabExplanation?: string;
  lastUpdated: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  relatedMembers: string[];
  category: 'breakthrough' | 'collaboration' | 'milestone' | 'challenge';
  timestamp: string;
}
