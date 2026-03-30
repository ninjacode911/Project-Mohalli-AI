"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Phone,
  Navigation,
  Globe,
  Share2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlaceDetail } from "@/types";

interface CardDetailProps {
  placeId: string;
  onBack: () => void;
}

export function CardDetail({ placeId, onBack }: CardDetailProps) {
  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/details/${placeId}`);
        if (!response.ok) {
          const data = (await response.json()) as { error: string };
          throw new Error(data.error);
        }

        const data = (await response.json()) as PlaceDetail;
        if (!cancelled) {
          setDetail(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load details"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const handleShare = async () => {
    const url = `${window.location.origin}?place=${placeId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback: do nothing
    }
  };

  const directionsUrl = detail
    ? `https://www.google.com/maps/dir/?api=1&destination=${detail.lat},${detail.lng}&destination_place_id=${detail.placeId}`
    : "#";

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-sm text-error">{error ?? "Details unavailable"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Name + rating */}
        <div>
          <h2 className="text-lg font-bold text-text-primary">{detail.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            {detail.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-text-primary">
                  {detail.rating.toFixed(1)}
                </span>
                <span className="text-sm text-text-muted">
                  ({detail.reviewCount} reviews)
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  detail.isOpen ? "bg-success" : "bg-error"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  detail.isOpen ? "text-success" : "text-error"
                }`}
              >
                {detail.isOpen ? "Open now" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-text-secondary">{detail.address}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          {detail.phone && (
            <a
              href={`tel:${detail.phone}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          )}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-muted"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </a>
          <button
            onClick={() => void handleShare()}
            className="flex items-center justify-center rounded-lg border border-border px-3 py-2.5 text-text-primary transition-colors hover:bg-muted"
            title="Copy link"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Phone number display */}
        {detail.formattedPhone && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Phone className="h-4 w-4 text-text-muted" />
            {detail.formattedPhone}
          </div>
        )}

        {/* Website */}
        {detail.website && (
          <a
            href={detail.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Globe className="h-4 w-4" />
            Visit website
          </a>
        )}

        {/* Operating hours */}
        {detail.weekdayHours.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text-primary">Hours</h3>
            </div>
            <div className="space-y-1 pl-6">
              {detail.weekdayHours.map((day, i) => {
                const today = new Date().getDay();
                // Google returns Mon=0, Sun=6. JS: Sun=0, Mon=1...
                const isToday = (i + 1) % 7 === today;
                return (
                  <p
                    key={i}
                    className={`text-xs ${
                      isToday
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {day}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        {detail.reviews.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text-primary">
                Reviews
              </h3>
            </div>
            <div className="space-y-3 pl-6">
              {detail.reviews.map((review, i) => (
                <div key={i} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${
                            s < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">
                      {review.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
