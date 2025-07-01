
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe } from "lucide-react";
import MembershipForm from "@/components/MembershipForm";
import Footer from "@/components/Footer";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <MembershipForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary font-clash">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center animate-fade-in">
          {/* Logo/Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              SSF HSS Membership Portal
            </h1>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>

          {/* Malayalam Tagline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 mx-auto max-w-4xl animate-slide-up">
            <div className="text-white/90 text-lg sm:text-2xl font-medium leading-relaxed">
              ശരികളുടെ ശബ്ദമാവുക - ഹയർസെക്കണ്ടറി മെമ്പർഷിപ്പ് കാമ്പയിൻ
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => setShowForm(true)}
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
            size="lg"
          >
            Apply Membership Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-white font-semibold">Join Community</div>
              <div className="text-white/80 text-sm">Connect with peers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-white font-semibold">Get Recognition</div>
              <div className="text-white/80 text-sm">Digital certificate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Globe className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-white font-semibold">Make Impact</div>
              <div className="text-white/80 text-sm">Voice for change</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              About the Membership Campaign
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 text-gray-600 leading-relaxed">
              <p className="text-lg mb-4">
                [Placeholder for Malayalam content about the SSF HSS Membership Campaign]
              </p>
              <p className="text-lg mb-4">
                [Details about the campaign objectives, benefits, and impact]
              </p>
              <p className="text-lg">
                [Information about student participation and community building]
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
