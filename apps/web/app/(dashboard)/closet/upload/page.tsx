"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TYPES   = ["top", "bottom", "shoes", "outerwear", "accessory", "dress"];
const STYLES  = ["casual", "formal", "traditional", "sporty", "streetwear"];
const SEASONS = ["all", "summer", "winter", "rainy"];
const COLORS  = ["black", "white", "grey", "navy", "brown", "beige", "red", "green", "blue", "yellow", "pink", "orange", "purple"];

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [type, setType]         = useState("");
  const [style, setStyle]       = useState("");
  const [season, setSeason]     = useState("all");
  const [colors, setColors]     = useState<string[]>([]);
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function toggleColor(c: string) {
    setColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file)           return setError("Please select an image");
    if (!type)           return setError("Select a clothing type");
    if (!style)          return setError("Select a style");
    if (colors.length === 0) return setError("Select at least one color");

    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("image",  file);
    form.append("type",   type);
    form.append("style",  style);
    form.append("season", season);
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

  return (
    <main className="min-h-screen bg-neutral-50 pb-12">
      <div className="max-w-lg mx-auto px-4 pt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors">
            ←
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-neutral-900">Add to Closet</h1>
            <p className="text-neutral-500 text-xs">Upload a photo of your item</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className={cn(
              "w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
              preview ? "border-transparent p-0 overflow-hidden" : "border-neutral-200 hover:border-primary-400 bg-white"
            )}
          >
            {preview ? (
              <div className="relative w-full h-full">
                <Image src={preview} alt="preview" fill className="object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <span className="text-white font-medium text-sm">Change photo</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 p-8">
                <span className="text-4xl">📸</span>
                <p className="text-neutral-600 font-medium text-sm">Tap to upload photo</p>
                <p className="text-neutral-400 text-xs">JPG, PNG or WEBP · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

          {/* Name (optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Name <span className="text-neutral-400">(optional)</span></label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. White linen shirt"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-base outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium capitalize transition-all", type === t ? "bg-primary-400 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-400")}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} type="button" onClick={() => setStyle(s)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium capitalize transition-all", style === s ? "bg-primary-400 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-400")}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Colors <span className="text-neutral-400">(pick all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => toggleColor(c)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium capitalize transition-all", colors.includes(c) ? "bg-primary-400 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-400")}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Season</label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <button key={s} type="button" onClick={() => setSeason(s)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium capitalize transition-all", season === s ? "bg-primary-400 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-400")}
                >{s}</button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

          <Button type="submit" loading={loading}>
            Add to my closet ✨
          </Button>

        </form>
      </div>
    </main>
  );
}
