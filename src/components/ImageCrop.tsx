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
        width: 50,
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
      const crop = centerAspectCrop(
        img.naturalWidth,
        img.naturalHeight,
        aspectRatio
      );
      setCrop(crop);
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

  useEffect(() => {
    if (contRef.current && imageRef) {
      const { naturalWidth, naturalHeight } = imageRef;
      const contWidth = contRef.current.clientWidth;
      const contHeight = contRef.current.clientHeight;

      const cropWidth =
        contWidth * (naturalHeight / naturalWidth) <= contHeight
          ? contWidth
          : contHeight * (naturalWidth / naturalHeight);

      const cropContainer = contRef.current.querySelector(
        "#crop-container"
      ) as HTMLDivElement;

      if (cropContainer) {
        cropContainer.style.width = `${cropWidth}px`;
        cropContainer.style.aspectRatio = `${naturalWidth / naturalHeight}`;
      }
    }
  }, [imageRef]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-max max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4" ref={contRef}>
          {mode === "cropping" && (
            <>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={aspectRatio}
                style={{
                  maxHeight: "60vh",
                  width: "100%",
                  objectFit: "contain",
                }}
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
            <div className="flex flex-col gap-4 items-center">
              <img
                src={croppedImageUrl}
                alt="Preview"
                className="max-w-xs border rounded shadow"
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
