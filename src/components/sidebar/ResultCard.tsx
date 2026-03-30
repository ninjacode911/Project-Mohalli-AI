"use client";

import { useState } from "react";
import { Star, MapPin, Phone, Navigation, ChevronDown, ExternalLink } from "lucide-react";
import type { ServiceResult } from "@/types";

interface ResultCardProps {
  result: ServiceResult;
  index: number;
  isActive: boolean;
  onHover: (placeId: string | null) => void;
  onClick: (placeId: string) => void;
  onViewDetails: (placeId: string) => void;
}

export function ResultCard({
  result,
  index,
  isActive,
  onHover,
  onClick,
  onViewDetails,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded((prev) => !prev);
    onClick(result.placeId);
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${result.lat},${result.lng}&destination_place_id=${result.placeId}`;

  return (
    <article
      id={`result-card-${result.placeId}`}
      className={`border-b border-border transition-colors ${
        isActive ? "bg-muted border-l-2 border-l-primary" : "hover:bg-muted/50"
      }`}
      onMouseEnter={() => onHover(result.placeId)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Collapsed view — always visible */}
      <button
        onClick={handleClick}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Number badge */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          {/* Name */}
          <p className="truncate text-sm font-semibold text-text-primary">
            {result.name}
          </p>

          {/* Rating + distance row */}
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            {result.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-text-primary">
                  {result.rating.toFixed(1)}
                </span>
                <span className="text-xs text-text-muted">
                  ({result.reviewCount})
                </span>
              </div>
            )}

            <span className="text-xs text-text-muted">
              {result.distance} {result.distanceUnit}
            </span>

            {/* Open/Closed */}
            <div className="flex items-center gap-1">
              {result.hours === "Hours not available" ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-text-muted" />
                  <span className="text-xs text-text-muted">Hours N/A</span>
                </>
              ) : (
                <>
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      result.isOpen ? "bg-success animate-pulse" : "bg-error"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      result.isOpen ? "text-success" : "text-error"
                    }`}
                  >
                    {result.hours}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-1 flex items-start gap-1">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-text-muted" />
            <p className="line-clamp-1 text-xs text-text-secondary">
              {result.address}
            </p>
          </div>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-text-muted transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-border bg-surface px-4 pb-3 pt-2">
          {/* Full address */}
          <p className="text-xs text-text-secondary">{result.address}</p>

          {/* Hours */}
          <p className="mt-1 text-xs text-text-muted">{result.hours}</p>

          {/* Action buttons */}
          <div className="mt-3 flex gap-2">
            {result.phone && (
              <a
                href={`tel:${result.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Now
              </a>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-muted"
            >
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(result.placeId);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Details
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
