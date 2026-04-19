"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TYPES  = [
  { value: "top",       label: "Top",       emoji: "👕" },
  { value: "bottom",    label: "Bottom",    emoji: "👖" },
  { value: "dress",     label: "Dress",     emoji: "👗" },
  { value: "shoes",     label: "Shoes",     emoji: "👟" },
  { value: "outerwear", label: "Outerwear", emoji: "🧥" },
  { value: "accessory", label: "Accessory", emoji: "🧣" },
];

const STYLES = [
  { value: "casual",      label: "Casual"      },
  { value: "formal",      label: "Formal"      },
  { value: "traditional", label: "Traditional" },
  { value: "sporty",      label: "Sporty"      },
  { value: "streetwear",  label: "Street"      },
];

const COLORS = [
  { value: "black",  hex: "#111827" },
  { value: "white",  hex: "#F9FAFB" },
  { value: "grey",   hex: "#9CA3AF" },
  { value: "navy",   hex: "#1E3A5F" },
  { value: "brown",  hex: "#92400E" },
  { value: "beige",  hex: "#D4B896" },
  { value: "red",    hex: "#EF4444" },
  { value: "green",  hex: "#10B981" },
  { value: "blue",   hex: "#3B82F6" },
  { value: "yellow", hex: "#F59E0B" },
  { value: "pink",   hex: "#EC4899" },
  { value: "orange", hex: "#F97316" },
  { value: "purple", hex: "#8B5CF6" },
];

export default function UploadPage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file,    setFile]    = useState<File | null>(null);
  const [type,    setType]    = useState("");
  const [style,   setStyle]   = useState("");
  const [colors,  setColors]  = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("#000000");
  const [showPicker,  setShowPicker]  = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function toggleColor(c: string) {
    setColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  function addCustomColor() {
    const label = customColor.toLowerCase();
    if (!colors.includes(label)) setColors((prev) => [...prev, label]);
    setShowPicker(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file)             return setError("Please select an image");
    if (!type)             return setError("Select a clothing type");
    if (!style)            return setError("Select a style");
    if (colors.length === 0) return setError("Select at least one color");

    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("image",  file);
    form.append("type",   type);
    form.append("style",  style);
    form.append("season", "all");
    form.append("color",  colors.join(","));
    if (name) form.append("name", name);

    try {
      await api.post("/clothing", form, { headers: { "Content-Type": "multipart/form-data" } });
      router.push("/closet");
    } catch (e: any) {
      setError(e.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // Step indicator — which step is complete
  const step = !file ? 0 : !type ? 1 : !style ? 2 : colors.length === 0 ? 3 : 4;

  return (
    <main className="min-h-screen bg-neutral-50 pb-32">
      <div className="max-w-lg mx-auto px-4 pt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-neutral-900">Add to Closet</h1>
            <p className="text-neutral-500 text-xs">
              {step === 0 && "Start with a photo"}
              {step === 1 && "What type of item is this?"}
              {step === 2 && "What's the style?"}
              {step === 3 && "Pick the colors"}
              {step === 4 && "Looking good — ready to save!"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {[0,1,2,3].map((s) => (
            <div key={s} className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              step > s ? "bg-primary-400" : "bg-neutral-200"
            )} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Image Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className={cn(
              "w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
              preview ? "border-transparent p-0 overflow-hidden" : "border-neutral-200 hover:border-primary-400 bg-white"
            )}
          >
            {preview ? (
              <div className="relative w-full h-full">
                <Image src={preview} alt="preview" fill className="object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                  <span className="text-white font-semibold text-sm bg-black/40 px-4 py-2 rounded-full">Change photo</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 p-8">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">📸</span>
                </div>
                <p className="text-neutral-700 font-semibold text-sm">Tap to upload photo</p>
                <p className="text-neutral-400 text-xs">JPG, PNG or WEBP · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

          {/* Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this item (optional)"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-neutral-400"
          />

          {/* Type — emoji grid */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Type</p>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all",
                    type === t.value
                      ? "bg-primary-400 text-white border-primary-400"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300"
                  )}
                >
                  <span className="text-xl">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style — horizontal pills */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Style</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {STYLES.map((s) => (
                <button key={s.value} type="button" onClick={() => setStyle(s.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
                    style === s.value
                      ? "bg-primary-400 text-white"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors — actual color swatches + custom picker */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Colors</p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleColor(c.value)}
                  title={c.value}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all duration-150",
                    c.value === "white" && "border border-neutral-200",
                    colors.includes(c.value)
                      ? "ring-2 ring-offset-2 ring-primary-400 scale-110"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}

              {/* Custom color swatches added by user */}
              {colors
                .filter((c) => c.startsWith("#"))
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    title={c}
                    className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-primary-400 scale-110 transition-all border border-white shadow"
                    style={{ backgroundColor: c }}
                  />
                ))
              }

              {/* + Custom color button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowPicker((v) => !v); setTimeout(() => colorInputRef.current?.click(), 50); }}
                  className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center hover:border-primary-400 transition-colors bg-white"
                  title="Pick custom color"
                >
                  <span className="text-neutral-400 text-lg leading-none">+</span>
                </button>

                {/* Hidden native color input */}
                <input
                  ref={colorInputRef}
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onBlur={addCustomColor}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Selected colors summary */}
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {colors.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-200 flex-shrink-0"
                      style={{ backgroundColor: c.startsWith("#") ? c : COLORS.find((x) => x.value === c)?.hex }}
                    />
                    {c.startsWith("#") ? c.toUpperCase() : c}
                    <button
                      type="button"
                      onClick={() => setColors((prev) => prev.filter((x) => x !== c))}
                      className="text-neutral-400 hover:text-red-500 transition-colors leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <Button type="submit" loading={loading}>
            {step < 4 ? `Complete ${["photo","type","style","color"][step]} to continue` : "Add to my closet ✨"}
          </Button>

        </form>
      </div>
    </main>
  );
}
