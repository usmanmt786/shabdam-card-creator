import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface FormData {
  hssmid: string;
  fullName: string;
  phone: string;
  schoolName: string;
  year: string;
  stream: string;
}

interface MembershipCardProps {
  formData: FormData;
  previewImage: string;
  onBack: () => void;
}

const MembershipCard = ({
  formData,
  previewImage,
  onBack,
}: MembershipCardProps) => {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8 ">
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
              Your membership application has been successfully submitted. Your
              digital membership card is ready!
            </div>
          </div>

          {/* Membership Card Preview */}
          <div className="bg-gradient-to-br from-primary to-secondary  rounded-2xl p-8 text-white shadow-2xl mb-8 animate-slide-up w-max mx-auto">
            <div className="relative text-card  w-[460px] h-[733px]">
              <img
                src="/card.png"
                alt="card"
                className="absolute inset-0 z-[5]"
              />
              <img
                src={previewImage}
                alt="profile"
                className="w-[37.7%] absolute top-[37.2%] left-[23.5%] h-auto z-0"
              />
              <h6 className="absolute text-lg top-[7.2%] left-[33%] font-bold text-black z-10">
                {formData.hssmid}
              </h6>
              <div className="w-max absolute top-[5.2%] right-[12%] z-10">
                <QRCode
                  className="h-16 w-16"
                  value={formData.hssmid}
                  size={128}
                />
              </div>
              <div className="absolute top-[63.2%] left-[23.5%] h-auto z-10 text-white w-[200px] flex flex-col gap-2">
                <h6 className=" text-2xl  font-bold  z-10">
                  {formData.fullName}
                </h6>
                <h6 className=" text-sm  font-bold  z-10">
                  {formData.schoolName.split(",").join(", ")}
                </h6>
                <h6 className=" text-sm  font-bold  z-10 flex gap-3 items-center">
                  {formData.year}  <span>|</span>   {formData.stream}
                </h6>
              </div>
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
