/**
 * Galería de fotos/evidencias de incidencia
 * Con zoom, metadata GPS y carousel
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  CheckCircle2,
  X,
  ZoomIn
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Photo } from "@/lib/mock/types";

interface IncidentPhotosGalleryProps {
  photos: Photo[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

const zoomVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      duration: 0.5,
      bounce: 0.2,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Generate placeholder image URLs for demo
function getPhotoUrl(photo: Photo): string {
  // In production, this would use the actual storage path
  // For now, using placeholder
  const seed = photo.id.replace(/[^a-z0-9]/gi, "");
  return `https://picsum.photos/seed/${seed}/800/600`;
}

function getThumbnailUrl(photo: Photo): string {
  const seed = photo.id.replace(/[^a-z0-9]/gi, "");
  return `https://picsum.photos/seed/${seed}/200/150`;
}

export function IncidentPhotosGallery({ photos }: IncidentPhotosGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [direction, setDirection] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg border-2 border-dashed">
        <p className="text-sm text-muted-foreground">Sin evidencia fotográfica</p>
      </div>
    );
  }

  const currentPhoto = photos[selectedIndex];

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setSelectedIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Photo Display */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={selectedIndex}
            src={getPhotoUrl(currentPhoto)}
            alt={`Evidencia ${selectedIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
              onClick={() => navigate(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity size-8"
          onClick={() => setIsZoomed(true)}
        >
          <ZoomIn className="size-4" />
        </Button>

        {/* Photo Counter */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {selectedIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Metadata */}
      {currentPhoto.metadata && (
        <div className="flex flex-wrap gap-2">
          {currentPhoto.metadata.gpsLat && currentPhoto.metadata.gpsLng && (
            <Badge variant="outline" className="gap-1 text-xs">
              <MapPin className="size-3" />
              {currentPhoto.metadata.gpsLat.toFixed(4)}, {currentPhoto.metadata.gpsLng.toFixed(4)}
            </Badge>
          )}
          {currentPhoto.metadata.timestampDevice && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="size-3" />
              {format(new Date(currentPhoto.metadata.timestampDevice), "d MMM yyyy, HH:mm", {
                locale: es,
              })}
            </Badge>
          )}
          {currentPhoto.metadata.watermarkVerified && (
            <Badge variant="secondary" className="gap-1 text-xs text-success">
              <CheckCircle2 className="size-3" />
              Verificado
            </Badge>
          )}
        </div>
      )}

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <motion.button
              key={photo.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection(index > selectedIndex ? 1 : -1);
                setSelectedIndex(index);
              }}
              className={`relative shrink-0 size-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              }`}
            >
              <img
                src={getThumbnailUrl(photo)}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none" showCloseButton={false}>
          <div className="relative overflow-hidden rounded-lg bg-background">
          <DialogTitle className="sr-only">Vista ampliada de foto</DialogTitle>
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                variants={zoomVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative"
              >
                <img
                  src={getPhotoUrl(currentPhoto)}
                  alt={`Evidencia ${selectedIndex + 1}`}
                  className="w-full h-auto"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setIsZoomed(false)}
                >
                  <X className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
