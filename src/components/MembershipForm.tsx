/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, User, School, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MembershipCard from "@/components/MembershipCard";
import { districtDivisions, districts, schools } from "@/lib/consts";
import { ImageCropper } from "./ImageCrop";

// Define schema with Zod
const formSchema = z.object({
  hssmid: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  fullName: z.string().min(1, "Full name is required"),
  district: z.string().min(1, "District is required"),
  division: z.string().min(1, "Division is required"),
  schoolName: z.string().min(1, "School name is required"),
  year: z.string().min(1, "Year is required"),
  stream: z.string().min(1, "Stream is required"),
  profileImage: z.string().min(5, "Image is required"),
});

type FormData = z.infer<typeof formSchema>;

interface MembershipFormProps {
  onBack: () => void;
}

const MembershipForm = ({ onBack }: MembershipFormProps) => {
  const [showCard, setShowCard] = useState<{
    hssmid: string;
    fullName: string;
    phone: string;
    schoolName: string;
    year: string;
    stream: string;
  } | null>(null);
  const [showManualSchoolInput, setShowManualSchoolInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingMember, setIsCheckingMember] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [cropImage, setCropImage] = useState<{
    src: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      fullName: "",
      district: "",
      division: "",
      schoolName: "",
      year: "",
      stream: "",
    },
  });

  const formData = watch();

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Check member by phone number
  const checkMemberByPhone = useCallback(
    async (phone: string) => {
      if (phone.length !== 10) return;

      setIsCheckingMember(true);
      try {
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbxbUxXzale2LXzLFYcC-ALdjRTaGTlTxFMsra2U4lsUS_8Pckdt4qfHhgptPm0MaUwP/exec?phone=${phone}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.status === "success" && result.student) {
          const student = result.student;

          reset({
            hssmid: student["Membership ID"],
            phone: student["Phone Number"].toString(),
            fullName: student["Full Name"],
            year: student.Year.toString().includes("Plus")
              ? student.Year
              : `Plus ${student.Year}`,
            stream: student.Stream,
          });
          setValue("district", student.District);
          setTimeout(() => {
            setValue("division", student.Division);

            setValue(
              "schoolName",
              student["School Portal ID"] || student["School Name"]
            );
          }, 1000);

          if (!student["School Portal ID"]) setShowManualSchoolInput(true);
          toast({
            title: "Member Found!",
            description: "We've auto-filled your details from our records.",
          });
          setUserFound(true);
        } else {
          reset({
            phone: phoneInput.toString(),
            fullName: "",
            hssmid: "",
            district: "",
            division: "",
            schoolName: "",
            year: "",
            stream: "",
          });
          setShowManualSchoolInput(false);
        }
      } catch (error) {
        console.error("Error checking member:", error);
      } finally {
        setIsCheckingMember(false);
      }
    },
    [reset]
  );

  // Debounced version of checkMemberByPhone
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckMember = useCallback(
    debounce((phone: string) => checkMemberByPhone(phone), 1000),
    [checkMemberByPhone]
  );

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneInput(value.toString());
    setValue("phone", value.toString());
    if (value.length === 10) {
      debouncedCheckMember(value);
    } else {
      setUserFound(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    if (userFound) {
      setShowCard({
        hssmid: data.hssmid,
        fullName: data.fullName,
        phone: data.phone,
        schoolName: data.schoolName,
        year: data.year,
        stream: data.stream,
      });
      return;
    }
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxmJnf27oJTIMaiK-GrffLTArUyC6h6xx_IiJdfCgGUyRM83XK7CO3LkegIO62Q9YFB/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            name: data.fullName,
            phone: data.phone,
            district: data.district,
            division: data.division,
            schoolName: parseInt(data.schoolName)
              ? schools.find(
                  (school) => school.id === parseInt(data.schoolName)
                )?.name || ""
              : data.schoolName,
            portalId: parseInt(data.schoolName) || "",
            year: data.year,
            stream: data.stream,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.text();
      const memberId = result;

      toast({
        title: "Application Submitted!",
        description:
          "Your membership application has been successfully submitted.",
      });
      setShowCard({
        hssmid: memberId,
        fullName: data.fullName,
        phone: data.phone,
        schoolName: data.schoolName,
        year: data.year,
        stream: data.stream,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setImageKey(Date.now());
      setCropImage({
        src: image,
        onCropComplete: (value) => {
          setValue("profileImage", value);
        },
        onClose: () => setCropImage(null),
      });
    }
  };

  if (showCard) {
    return (
      <MembershipCard
        formData={showCard}
        previewImage={formData.profileImage}
        onBack={() => {
          setShowCard(null);
          setIsSubmitting(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative">
      {/* Full-screen loading overlay */}
      {(isSubmitting || isCheckingMember) && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {isCheckingMember
                ? "Checking member..."
                : "Submitting your application..."}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100"
        >
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number - Now first field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  className={`${errors.phone ? "border-red-500" : ""}`}
                  placeholder="10 digit phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className={`${errors.fullName ? "border-red-500" : ""}`}
                  placeholder="Enter your full name"
                  disabled={userFound}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Profile Photo (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setValue("profileImage", "")}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    key={imageKey}
                  />
                  <Label
                    htmlFor="profileImage"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {formData.profileImage ? "Change Photo" : "Choose Photo"}
                  </Label>

                  {errors.profileImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profileImage.message}
                    </p>
                  )}
                  {userFound && (
                    <p className="text-yellow-500 text-sm">
                      Kindly choose a photo to generate your Membership Card
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* School Information Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
              <School className="h-5 w-5 mr-2 text-primary" />
              School Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">District *</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => {
                    setValue("district", value);
                    setValue("division", "");
                    setValue("schoolName", "");
                  }}
                  disabled={userFound}
                >
                  <SelectTrigger
                    className={`${errors.district ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* Division */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Division *</Label>
                <Select
                  value={formData.division}
                  onValueChange={(value) => {
                    setValue("division", value);
                  }}
                  disabled={!formData.district || userFound}
                >
                  <SelectTrigger
                    className={`${errors.division ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {(districtDivisions[formData.district] || []).map(
                      (division: string) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {errors.division && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.division.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {/* School Name */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  School Name *
                </Label>

                {!showManualSchoolInput ? (
                  <>
                    <Select
                      value={formData.schoolName}
                      onValueChange={(value) => {
                        setValue("schoolName", value);
                        setShowManualSchoolInput(false);
                      }}
                      disabled={!formData.district || userFound}
                    >
                      <SelectTrigger
                        className={`${
                          errors.schoolName ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Search or select school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools
                          .filter(
                            (school) =>
                              formData.district &&
                              school.district === formData.district
                          )
                          .map((school) => (
                            <SelectItem
                              key={school.id}
                              value={school.id.toString()}
                            >
                              {school.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <button
                      type="button"
                      onClick={() => setShowManualSchoolInput(true)}
                      className="text-sm text-primary hover:underline mt-2 disabled:hidden"
                      disabled={userFound}
                    >
                      Can't find your school? Enter manually
                    </button>
                  </>
                ) : (
                  <>
                    <Input
                      value={formData.schoolName}
                      onChange={(e) => setValue("schoolName", e.target.value)}
                      placeholder="Type school name manually"
                      className="mt-2"
                      disabled={userFound}
                    />
                    <button
                      type="button"
                      onClick={() => setShowManualSchoolInput(false)}
                      className="text-sm text-primary hover:underline mt-2 disabled:hidden"
                      disabled={userFound}
                    >
                      Select from list
                    </button>
                  </>
                )}
                {errors.schoolName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.schoolName.message}
                  </p>
                )}
              </div>

              {/* Year and Stream */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Year */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Year *</Label>
                  <RadioGroup
                    value={formData.year}
                    onValueChange={(value) => setValue("year", value)}
                    className="flex gap-4"
                    disabled={userFound}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Plus One" id="year1" />
                      <Label htmlFor="year1">1st Year</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Plus Two" id="year2" />
                      <Label htmlFor="year2">2nd Year</Label>
                    </div>
                  </RadioGroup>
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Stream */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Stream *</Label>
                  <RadioGroup
                    value={formData.stream}
                    onValueChange={(value) => setValue("stream", value)}
                    className="flex gap-4"
                    disabled={userFound}
                  >
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
                  {errors.stream && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stream.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : userFound
                ? "Generate Membership card"
                : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
      {cropImage && <ImageCropper {...cropImage} />}
    </div>
  );
};

export default MembershipForm;
