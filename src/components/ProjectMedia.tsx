import React, { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { API_URL } from '../config';

/**
 * Normalises an image value stored on a project.
 * - Absolute URLs / data URIs are used as-is
 * - /uploads/... files are served by the API server
 * - Bare filenames (e.g. "authentiq.jpg") are treated as files in /public
 */
export const resolveProjectImage = (image?: string): string => {
  if (!image) return '';
  if (image.startsWith('/uploads')) return `${API_URL}${image}`;
  if (/^(https?:)?\/\//i.test(image) || image.startsWith('data:') || image.startsWith('/')) {
    return image;
  }
  return `/${image.replace(/^\.?\//, '')}`;
};

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / 1280);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black">
      <iframe
        src={src}
        title={title}
        style={{
          width: '1280px',
          height: '720px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="absolute top-0 left-0 border-none transition-transform duration-700"
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
};

interface ProjectMediaProps {
  image?: string;
  demoLink?: string;
  title: string;
}

/**
 * Renders a project cover image when available, otherwise falls back to the
 * live iframe preview, and finally to a styled placeholder.
 */
const ProjectMedia = ({ image, demoLink, title }: ProjectMediaProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedImage = resolveProjectImage(image);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  if (resolvedImage && !imageFailed) {
    return (
      <img
        src={resolvedImage}
        alt={title}
        onError={() => setImageFailed(true)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  if (demoLink) {
    return <IframePreview src={demoLink} title={title} />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#160a22] to-black px-4 text-center">
      <ImageOff size={20} className="text-[#d946ef]/60" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{title}</span>
      <span className="text-[9px] text-slate-600">No preview available</span>
    </div>
  );
};

export default ProjectMedia;
