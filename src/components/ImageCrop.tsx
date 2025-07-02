import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface ImageCropperProps {
  src: string;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCropComplete,
  onClose,
  aspectRatio = 1, // Default square
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"cropping" | "preview">("cropping");
  const [isProcessing, setIsProcessing] = useState(false);
  const contRef = useRef<HTMLDivElement>(null);

  const onLoad = useCallback(
    (img: HTMLImageElement) => {
      setImageRef(img);
      const { naturalWidth, naturalHeight } = img;
      const crop = centerAspectCrop(naturalWidth, naturalHeight, aspectRatio);
      setCrop(crop);
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      const containerWidth = Math.min(screenWidth * 0.7, 896);
      const containerHeight = Math.min(screenHeight * 0.6, 640);
      let width = Math.min(containerWidth, naturalWidth);
      let height = (naturalHeight / naturalWidth) * width;

      if (height > containerHeight) {
        height = containerHeight;
        width = (naturalWidth / naturalHeight) * height;
      }

      contRef.current!.style.width = `${width}px`;
      contRef.current!.style.height = `${height}px`;
    },
    [aspectRatio]
  );

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    if (crop.unit == "%") {
      crop.width = (image.width * crop.width!) / 100;
      crop.height = (image.height * crop.height!) / 100;
      crop.x = (image.width * crop.x!) / 100;
      crop.y = (image.height * crop.y!) / 100;
    }
    canvas.width = (naturalWidth * crop.width!) / image.width;
    canvas.height = (naturalHeight * crop.height!) / image.height;

    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      image,
      (crop.x! / image.width) * naturalHeight, // start x based on natural size
      (crop.y! / image.height) * naturalHeight, // start y based on natural size
      (crop.width! / image.width) * naturalWidth, // crop width
      (crop.height! / image.height) * naturalHeight, // crop height
      0,
      0,
      canvas.width, // destination width
      canvas.height // destination height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };
  const handleCrop = async () => {
    if (!imageRef || !crop?.width || !crop?.height) return;
    setIsProcessing(true);

    const croppedUrl = await getCroppedImg(imageRef, crop);
    setCroppedImageUrl(croppedUrl);
    setMode("preview");
    setIsProcessing(false);
  };

  const handleRecrop = () => {
    setCroppedImageUrl(null);
    onCropComplete("");
    setMode("cropping");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className=" flex flex-col delay-1000">
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1" ref={contRef}>
          {mode === "cropping" && (
            <>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                className="w-full flex-1 object-contain"
                aspect={aspectRatio}
              >
                <img
                  src={src}
                  alt="Crop"
                  onLoad={(e) => onLoad(e.currentTarget)}
                  className="max-w-full max-h-full object-contain"
                />
              </ReactCrop>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleCrop} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Crop Image"}
                </Button>
              </div>
            </>
          )}

          {mode === "preview" && croppedImageUrl && (
            <div className="flex flex-col gap-4 items-center w-full flex-1 object-contain">
              <img
                src={croppedImageUrl}
                alt="Preview"
                className="max-w-full max-h-full border rounded shadow"
                onLoad={(e) => onLoad(e.currentTarget)}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleRecrop}>
                  Re-Crop
                </Button>
                <Button
                  onClick={() => {
                    onCropComplete(croppedImageUrl);
                    onClose();
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
