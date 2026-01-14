import { aiInsights } from '@/data/labMembers';
import InsightCard from '@/components/InsightCard';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';

const AIInsights = () => {
  const breakthroughs = aiInsights.filter((i) => i.category === 'breakthrough');
  const collaborations = aiInsights.filter((i) => i.category === 'collaboration');
  const milestones = aiInsights.filter((i) => i.category === 'milestone');

  return (
    <div className="min-h-screen pattern-dna">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-accent/10 to-transparent">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-accent mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Research Insights
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI has analyzed all team updates to surface key findings, potential collaborations, and research milestones you shouldn't miss.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{aiInsights.length}</p>
                <p className="text-sm text-muted-foreground">Total Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{breakthroughs.length}</p>
                <p className="text-sm text-muted-foreground">Breakthroughs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dry-lab/10 text-dry-lab">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{collaborations.length}</p>
                <p className="text-sm text-muted-foreground">Collaboration Opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {aiInsights.map((insight, index) => (
            <div
              key={insight.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>

        {/* AI Summary */}
        <div className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                Weekly Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This week has seen remarkable progress across multiple research fronts. Dr. Chen's CRISPR work on BRCA1 achieved exceptional editing efficiency, while Dr. Patel's antimicrobial peptide AMX-7 shows strong promise against drug-resistant infections. The computational team has made significant strides, with Marcus's protein prediction model reaching near state-of-the-art performance and Dr. Rodriguez uncovering metabolic vulnerabilities in cancer cells. Kevin's optogenetic circuit breakthrough opens new possibilities for controlled therapeutic delivery. The team should prioritize exploring the synergy between CRISPR validation and protein structure prediction, as well as the potential combination of AMX-7 with metabolic inhibitors for enhanced antimicrobial efficacy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIInsights;
