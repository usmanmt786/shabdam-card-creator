
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, User, Phone, MapPin, School, Calendar, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MembershipCard from "@/components/MembershipCard";

interface FormData {
  fullName: string;
  phone: string;
  district: string;
  division: string;
  schoolName: string;
  year: string;
  stream: string;
}

interface MembershipFormProps {
  onBack: () => void;
}

const districts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasargod"
];

const divisionsMap: { [key: string]: string[] } = {
  "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Kattakkada"],
  "Kollam": ["Kollam", "Punalur", "Kottarakkara"],
  "Ernakulam": ["Ernakulam", "Aluva", "Muvattupuzha", "Kothamangalam"],
  // Add more divisions as needed
};

const schools = [
  "Government Higher Secondary School, Thiruvananthapuram",
  "St. Mary's Higher Secondary School",
  "Christ Nagar Senior Secondary School",
  "Kendriya Vidyalaya",
  "Jawahar Navodaya Vidyalaya",
  // Add more schools as needed
];

const MembershipForm = ({ onBack }: MembershipFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    district: "",
    division: "",
    schoolName: "",
    year: "",
    stream: ""
  });
  const [showCard, setShowCard] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.division) newErrors.division = "Division is required";
    if (!formData.schoolName.trim()) newErrors.schoolName = "School name is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.stream) newErrors.stream = "Stream is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      toast({
        title: "Application Submitted!",
        description: "Your membership application has been successfully submitted.",
      });
      setShowCard(true);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (showCard) {
    return <MembershipCard formData={formData} onBack={() => setShowCard(false)} />;
  }

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
            Apply for Membership
          </h1>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-primary" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`border-2 focus:border-primary ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                10 Digit Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`border-2 focus:border-primary ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter 10 digit phone number"
                maxLength={10}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                District *
              </Label>
              <Select value={formData.district} onValueChange={(value) => {
                handleInputChange("district", value);
                handleInputChange("division", ""); // Reset division when district changes
              }}>
                <SelectTrigger className={`border-2 focus:border-primary ${errors.district ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg z-50">
                  {districts.map((district) => (
                    <SelectItem key={district} value={district} className="hover:bg-gray-50">
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </div>

            {/* Division */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Division *
              </Label>
              <Select 
                value={formData.division} 
                onValueChange={(value) => handleInputChange("division", value)}
                disabled={!formData.district}
              >
                <SelectTrigger className={`border-2 focus:border-primary ${errors.division ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg z-50">
                  {(divisionsMap[formData.district] || []).map((division) => (
                    <SelectItem key={division} value={division} className="hover:bg-gray-50">
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-gray-700 font-medium flex items-center">
                <School className="h-4 w-4 mr-2 text-primary" />
                School Name *
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                സ്കൂളിന്റെ പേര് ടൈപ്പ് ചെയ്ത ഡ്രോപ്‌ഡൗണിൽ നിന്ന് തിരഞ്ഞെടുക്കുക , ഡ്രോപ്‌ഡൗണിൽ ലഭിച്ചില്ലെങ്കിൽ മാത്രം ടൈപ്പ് ചെയ്യുക.
              </p>
              <Select value={formData.schoolName} onValueChange={(value) => handleInputChange("schoolName", value)}>
                <SelectTrigger className={`border-2 focus:border-primary ${errors.schoolName ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Select or type school name" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg z-50">
                  {schools.map((school) => (
                    <SelectItem key={school} value={school} className="hover:bg-gray-50">
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or type your school name manually"
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
                className="border-2 border-gray-200 focus:border-primary mt-2"
              />
              {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName}</p>}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Year *
              </Label>
              <RadioGroup value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1st" id="year1" />
                  <Label htmlFor="year1">1st Year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2nd" id="year2" />
                  <Label htmlFor="year2">2nd Year</Label>
                </div>
              </RadioGroup>
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>

            {/* Stream */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Stream *
              </Label>
              <RadioGroup value={formData.stream} onValueChange={(value) => handleInputChange("stream", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Science" id="science" />
                  <Label htmlFor="science">Science</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Commerce" id="commerce" />
                  <Label htmlFor="commerce">Commerce</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Humanities" id="humanities" />
                  <Label htmlFor="humanities">Humanities</Label>
                </div>
              </RadioGroup>
              {errors.stream && <p className="text-red-500 text-sm">{errors.stream}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipForm;
