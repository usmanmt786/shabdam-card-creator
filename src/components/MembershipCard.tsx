
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, User, MapPin, School, Calendar, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  phone: string;
  district: string;
  division: string;
  schoolName: string;
  year: string;
  stream: string;
}

interface MembershipCardProps {
  formData: FormData;
  onBack: () => void;
}

const MembershipCard = ({ formData, onBack }: MembershipCardProps) => {
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your membership card is being downloaded.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "⏳ Social media sharing will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-clash">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary ml-4">
            Your Membership Card
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 animate-fade-in">
            <div className="text-green-800 font-semibold text-lg mb-2">
              🎉 Congratulations!
            </div>
            <div className="text-green-700">
              Your membership application has been successfully submitted. Your digital membership card is ready!
            </div>
          </div>

          {/* Membership Card Preview */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white shadow-2xl mb-8 animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">SSF HSS</h2>
              <p className="text-white/90">Membership Card</p>
              <div className="w-16 h-1 bg-white/50 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Member Photo Placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                <User className="h-12 w-12 text-white/70" />
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-3 text-white/70" />
                <span className="font-semibold">{formData.fullName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-white/70" />
                <span>{formData.district}, {formData.division}</span>
              </div>
              <div className="flex items-center">
                <School className="h-4 w-4 mr-3 text-white/70" />
                <span className="text-sm">{formData.schoolName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-white/70" />
                  <span>{formData.year} Year</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-3 text-white/70" />
                  <span>{formData.stream}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-white/20 mt-6 pt-4 text-center">
              <p className="text-white/80 text-sm">
                Member ID: HSS{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-white/60 text-xs mt-1">
                Issued: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Card
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share on Social Media
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="text-primary font-semibold mb-2">What's Next?</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Your membership is now active</li>
              <li>• You will receive updates via phone/email</li>
              <li>• Join our community activities and events</li>
              <li>• Use your membership card for identification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
