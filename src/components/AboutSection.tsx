import { Users, Target, Award, Heart } from "lucide-react";

const AboutSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Community Access",
      description: "Connect with fellow HSS students across Kerala",
    },
    {
      icon: Target,
      title: "Educational Support",
      description: "Access to study materials and academic guidance",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Official membership recognition and certificates",
    },
    {
      icon: Heart,
      title: "Student Welfare",
      description: "Support for student welfare and development programs",
    },
  ];

  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            About Us
          </h2>

          {/* Malayalam paragraph placeholder */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-secondary font-malayalam text-left">
              വിദ്യാര്‍ഥികളുടെ കര്‍മ്മശേഷിയെ ലക്ഷ്യബോധത്തോടെ പ്രയോഗിക്കാന്‍
              കഴിയുമ്പോഴാണ് സര്‍ഗാത്മകമായ ഒരു രാഷ്ട്രത്തിന്റെ
              സൃഷ്ടിപ്പുണ്ടാക്കുന്നത്. സാമൂഹികമായും സാസ്‌കാരികമായും ധിഷണാപരമായും
              വിദ്യാര്‍ഥികള്‍ക്ക് ഒത്തുചേരാനുള്ള പക്വമായ നിലമൊരുക്കുകയാണ് കഴിഞ്ഞ
              അരനൂറ്റാണ്ടായി എസ്.എസ്.എഫ് കേരളത്തില്‍ നിര്‍വഹിച്ചുകൊണ്ടിരിക്കുന്ന
              ദൗത്യം. നേരും നെറികേടും തിരിച്ചറിയും വരെയുള്ള വിദ്യാര്‍ഥി കാലഘട്ടം
              തുഴയാനാളില്ലാത്ത നൗകയാണെന്ന തിരിച്ചറിവില്‍ നിന്നാണ് ദിശ
              നിര്‍ണയിക്കാനുള്ള ചൂട്ടുമായി എസ് എസ് എഫ് വിദ്യാർഥികൾക്കിടയിൽ
              കേഡര്‍ സ്വഭാവത്തിൽ പ്രവർത്തിച്ചു കൊണ്ടിരിക്കുന്നത്. ക്യാമ്പസുകൾ,
              സ്കൂളുകൾ, ഗ്രാമങ്ങൾ തുടങ്ങി വിദ്യാർഥികൾ ഉള്ളയിടങ്ങളിലൊക്കെ എസ് എസ്
              എഫ് കഴിഞ്ഞ അമ്പത് വർഷത്തിലേറെയായി പ്രവർത്തിച്ചു വരുന്നു.
              ഹയർസെക്കൻണ്ടറി സ്കൂളുകളിൽ ഔദ്യോഗിക യൂണിറ്റും കൃത്യതയോടെ
              ആവിഷ്കരിക്കുന്ന പദ്ധതികളും എസ് എസ് എഫിനുണ്ട്. ഓരോ വർഷവും
              പതിനായിരക്കണക്കിന് വിദ്യാർഥികൾ സ്കൂളുകളിൽ എസ് എസ് എഫ്
              അംഗത്വമെടുക്കുന്നു. ഈ വർഷം "ശരികളുടെ ശബ്ദമാവുക" എന്ന
              പ്രമേയത്തിലാണ് എസ് എസ് എഫിൻ്റെ ഹയർസെക്കണ്ടറി മെമ്പർഷിപ്പ്
              കാമ്പയിൻ ആചരിക്കുന്നത്
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
