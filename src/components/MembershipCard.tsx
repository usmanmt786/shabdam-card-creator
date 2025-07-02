import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";

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
  const contRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  useEffect(() => {
    QRCode.toDataURL(formData.hssmid, {
      errorCorrectionLevel: "H",
      width: 200,
      margin: 2,
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Failed to generate QR", err));
  }, [formData.hssmid]);
  const handleDownload = async () => {
    try {
      const dataUrl = await getDownloadUrl();
      if (!dataUrl) throw new Error("Failed to generate image");

      const link = document.createElement("a");
      link.download = `${formData.fullName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(dataUrl);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description:
          error instanceof Error ? error.message : "Failed downloading card",
      });
    }
  };
  const getDownloadUrl = async () => {
    try {
      document.body.style.touchAction = "none";
      const frameWidth = 460; // Your desired output width
      const frameHeight = 733; // Your desired output height
      const containerWidth = contRef.current.offsetWidth; // Current container width
      const containerHeight = contRef.current.offsetHeight; // Current container height

      const scaleX = frameWidth / containerWidth;
      const scaleY = frameHeight / containerHeight;

      const clone = contRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.top = "9999px";
      clone.style.left = "9999px";
      clone.style.width = frameWidth + "px";
      clone.style.height = frameHeight + "px ";
      clone.style.maxWidth = frameWidth + "px" || "100%";
      clone.style.visibility = "visible";
      clone.style.opacity = "1";
      const scale = Math.max(scaleX, scaleY);
      const hssmid = clone.querySelector("#hssmid") as HTMLElement;
      hssmid.style.fontSize = 30 * scale + "px";
      hssmid.style.top = "4%";
      const name = clone.querySelector("#name") as HTMLElement;
      name.style.fontSize = 20 * scale + "px";
      const school = clone.querySelector("#school") as HTMLElement;
      school.style.fontSize = 13 * scale + "px";
      const year = clone.querySelector("#year") as HTMLElement;
      year.style.fontSize = 12 * scale + "px";

      document.body.appendChild(clone);

      const images = clone.querySelectorAll("img");
      clone.style.border = "none";
      await Promise.all(
        Array.from(images).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () =>
                  reject(new Error(`Image failed to load: ${img.src}`));
              })
        )
      );

      let canvas;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          canvas = await html2canvas(clone, {
            backgroundColor: "white",
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: false,
            width: frameWidth,
            height: frameHeight,
            windowWidth: frameWidth,
            windowHeight: frameHeight,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
          });
          break;
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) throw error;
          await new Promise((resolve) => setTimeout(resolve, 300 * attempts));
        }
      }

      if (!canvas) throw new Error("Failed to generate canvas");

      const dataUrl = canvas.toDataURL("image/png");

      return dataUrl;
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      const clones = document.querySelectorAll('[style*="fixed"]');
      clones.forEach((clone) => document.body.removeChild(clone));
    }
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "⏳ Social media sharing will be available soon.",
    });
  };
  useEffect(() => {
    if (contRef.current) {
      const width = contRef.current.clientWidth;
      const height = contRef.current.clientHeight;
      const scaleX = width / 460;
      const scaleY = height / 733;

      setScale({
        x: scaleX,
        y: scaleY,
      });
    }
  }, [contRef]);

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
          <div className="bg-gradient-to-br from-primary to-secondary  rounded-2xl p-8 text-white shadow-2xl mb-8 animate-slide-up w-full mx-auto">
            <div
              className="relative text-card w-full aspect-[460/733] h-auto max-w-[460px] max-h-[733px]  mx-auto"
              ref={contRef}
            >
              <img
                src="/card.png"
                alt="card"
                className="absolute inset-0 z-[5]"
              />
              <img
                src={previewImage}
                alt="profile"
                className="w-[37.7%] absolute top-[37.1%] left-[23.35%] h-auto z-0"
              />
              <h6
                className="absolute  top-[5.8%] left-[33%]  font-card font-[600] text-black z-10"
                id="hssmid"
                style={{
                  fontSize: `${30 * Math.max(scale.x, scale.y)}px`,
                }}
              >
                {formData.hssmid}
              </h6>

              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{ backgroundColor: "transparent" }}
                  className="aspect-square w-[15.5%] h-auto absolute top-[4.6%] right-[5.8%] z-10"
                />
              )}

              <div className="absolute top-[62.2%] left-[23.5%] h-auto z-10 text-white w-[44%]  flex flex-col gap-2">
                <h6
                  className="font-semibold leading-tight font-card z-10 capitalize"
                  id="name"
                  style={{
                    fontSize: `${20 * Math.max(scale.x, scale.y)}px`,
                  }}
                >
                  {formData.fullName}
                </h6>
                <h6
                  className=" font-semibold leading-tight font-card  z-10"
                  style={{
                    fontSize: `${13 * Math.max(scale.x, scale.y)}px`,
                  }}
                  id="school"
                >
                  {formData.schoolName.split(",").join(", ")}
                </h6>
                <h6
                  className=" font-medium  z-10 flex gap-1 font-card items-center"
                  style={{
                    fontSize: `${12 * Math.max(scale.x, scale.y)}px`,
                  }}
                  id="year"
                >
                  {formData.year} <span>|</span> {formData.stream}
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
