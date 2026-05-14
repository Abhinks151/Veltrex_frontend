import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";

const ASPECT_RATIO = 1;
const DEFAULT_WIDTH = 90;

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: DEFAULT_WIDTH,
      },
      ASPECT_RATIO,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
}

interface ImageCropperProps {
  imgSrc: string;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ imgSrc, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height);
    setCrop(initialCrop);
    setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
  }

  const handleDone = async () => {
    if (!completedCrop || !imgRef.current) return;
    const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 overflow-hidden flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">Crop Profile Image</h3>

        <div className="relative max-h-[60vh] overflow-auto mb-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIO}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imgSrc}
              onLoad={onImageLoad}
              alt="Upload"
              className="max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDone} className="flex-1 sm:flex-none">
            Crop & Save
          </Button>
        </div>
      </div>
    </div>
  );
};
