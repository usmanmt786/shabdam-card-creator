
import { Users, Target, Award, Heart } from "lucide-react";

const AboutSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Community Access",
      description: "Connect with fellow HSS students across Kerala"
    },
    {
      icon: Target,
      title: "Educational Support",
      description: "Access to study materials and academic guidance"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Official membership recognition and certificates"
    },
    {
      icon: Heart,
      title: "Student Welfare",
      description: "Support for student welfare and development programs"
    }
  ];

  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            About the Membership Campaign
          </h2>
          
          {/* Malayalam paragraph placeholder */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-secondary">
              <p className="text-gray-600 text-sm mb-4">Malayalam Paragraph Placeholder</p>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-secondary/20"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
