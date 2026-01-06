"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { canUseModel, defaultModelKeyForTier, getModelCatalog, tierFromPlanKey, type ModelKey, type PlanTier } from "@/lib/model-access"
import { Loader2, Upload } from "lucide-react"

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

async function compressImageFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = objectUrl
    })

    const maxDimension = 1024
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas not supported")
    ctx.drawImage(image, 0, 0, width, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      const quality = clampNumber(0.85, 0.5, 0.95)
      canvas.toBlob(
        (b) => {
          if (!b) reject(new Error("Failed to encode image"))
          else resolve(b)
        },
        "image/jpeg",
        quality,
      )
    })

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error("Failed to read image"))
      reader.readAsDataURL(blob)
    })

    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function Generator() {
  const [prompt, setPrompt] = useState("")
  const [selectedModelKey, setSelectedModelKey] = useState<ModelKey>("nano_banana")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [result, setResult] = useState<string>("")
  const [resultImages, setResultImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreparingImage, setIsPreparingImage] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [planKey, setPlanKey] = useState<string | null>(null)
  const [isEntitled, setIsEntitled] = useState(false)
  const [isBillingLoading, setIsBillingLoading] = useState(false)
  const [tier, setTier] = useState<PlanTier>("pro")
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [promptError, setPromptError] = useState<string | null>(null)

  // Prompt builder state
  const [showPromptBuilder, setShowPromptBuilder] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState("none")
  const [selectedLighting, setSelectedLighting] = useState("none")
  const [selectedStyle, setSelectedStyle] = useState("none")
  const [selectedQuality, setSelectedQuality] = useState("none")

  // Prompt builder options
  const promptOptions = {
    backgrounds: [
      { value: "none", label: "Keep original background" },
      { value: "modern office with large windows and city view", label: "🏢 Modern Office" },
      { value: "tropical beach at golden hour with palm trees", label: "🏖️ Tropical Beach" },
      { value: "snowy mountain landscape at sunset", label: "🏔️ Snowy Mountains" },
      { value: "cozy coffee shop interior with warm ambiance", label: "☕ Coffee Shop" },
      { value: "urban street at night with neon lights", label: "🌃 Urban Night" },
      { value: "elegant studio with professional backdrop", label: "📸 Studio Setup" },
      { value: "lush forest with natural sunlight filtering through trees", label: "🌲 Forest Scene" },
      { value: "minimalist white room with soft shadows", label: "⬜ Minimalist Room" },
    ],
    lighting: [
      { value: "none", label: "Keep original lighting" },
      { value: "natural daylight from windows", label: "☀️ Natural Daylight" },
      { value: "warm golden hour lighting", label: "🌅 Golden Hour" },
      { value: "soft studio lighting with rim light", label: "💡 Studio Lighting" },
      { value: "dramatic side lighting with shadows", label: "🎭 Dramatic Light" },
      { value: "bright even lighting", label: "✨ Bright Even" },
      { value: "moody low-key lighting", label: "🌙 Moody Dark" },
      { value: "backlit with lens flare effect", label: "🔆 Backlit Glow" },
    ],
    styles: [
      { value: "none", label: "No specific style" },
      { value: "photorealistic, professional photography", label: "📷 Photorealistic" },
      { value: "cinematic, movie-like quality", label: "🎬 Cinematic" },
      { value: "portrait style with bokeh background", label: "👤 Portrait Mode" },
      { value: "fashion editorial style", label: "👗 Fashion Editorial" },
      { value: "vintage film photography aesthetic", label: "📼 Vintage Film" },
      { value: "modern commercial advertising style", label: "📺 Commercial" },
      { value: "artistic, creative composition", label: "🎨 Artistic" },
    ],
    quality: [
      { value: "none", label: "Standard quality" },
      { value: "high detail, sharp focus, 8K quality", label: "⭐ Ultra High Quality" },
      { value: "professional grade, magazine quality", label: "📰 Magazine Quality" },
      { value: "crisp details, perfect clarity", label: "🔍 Crystal Clear" },
      { value: "soft focus, dreamy atmosphere", label: "✨ Soft & Dreamy" },
    ],
  }

  // Build prompt from selections
  const buildPromptFromSelections = () => {
    const parts: string[] = []
    
    if (selectedBackground && selectedBackground !== "none") {
      parts.push(`Change background to ${selectedBackground}`)
    }
    
    if (selectedLighting && selectedLighting !== "none") {
      parts.push(`add ${selectedLighting}`)
    }
    
    if (selectedStyle && selectedStyle !== "none") {
      parts.push(`apply ${selectedStyle}`)
    }
    
    if (selectedQuality && selectedQuality !== "none") {
      parts.push(selectedQuality)
    }
    
    if (parts.length > 0) {
      parts.push("keep subject in focus and well-composed")
      const builtPrompt = parts.join(", ")
      setPrompt(builtPrompt)
      setShowPromptBuilder(false)
    }
  }

  // Reset prompt builder
  const resetPromptBuilder = () => {
    setSelectedBackground("none")
    setSelectedLighting("none")
    setSelectedStyle("none")
    setSelectedQuality("none")
  }

  const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  const refreshEntitlement = async (u: User | null) => {
    if (!supabaseEnabled || !u) {
      setPlanKey(null)
      setIsEntitled(false)
      setTier("pro")
      return
    }

    setIsBillingLoading(true)
    try {
      const res = await fetch("/api/billing/status")
      const data: unknown = await res.json().catch(() => ({}))

      const pk =
        typeof data === "object" && data && "planKey" in data && typeof (data as { planKey?: unknown }).planKey === "string"
          ? (data as { planKey: string }).planKey
          : null

      const entitled =
        typeof data === "object" &&
        data &&
        "entitled" in data &&
        typeof (data as { entitled?: unknown }).entitled === "boolean"
          ? (data as { entitled: boolean }).entitled
          : false

      setPlanKey(pk)
      setIsEntitled(entitled)

      const nextTier = tierFromPlanKey(pk)
      setTier(nextTier)
      setSelectedModelKey((prev) => {
        if (canUseModel(nextTier, prev)) return prev
        return defaultModelKeyForTier(nextTier)
      })
    } finally {
      setIsBillingLoading(false)
    }
  }

  useEffect(() => {
    if (!supabaseEnabled) return
    const supabase = createSupabaseBrowserClient()

    void (async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      void refreshEntitlement(data.user ?? null)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      void refreshEntitlement(u)
    })

    return () => sub.subscription.unsubscribe()
  }, [supabaseEnabled])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setError(null)
    setResult("")
    setResultImages([])
    setFileSize(file.size)

    // Validate file type immediately
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload an image file (JPEG, PNG, WebP, or GIF).`)
      setUploadedImage(null)
      setFileSize(null)
      return
    }

    // Validate file size before compression
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`)
      setUploadedImage(null)
      setFileSize(null)
      return
    }

    void (async () => {
      setIsPreparingImage(true)
      try {
        const dataUrl = await compressImageFile(file)
        if (dataUrl.length > 4_000_000) {
          setError("Image too large after encoding. Please use a smaller image.")
          setUploadedImage(null)
          setFileSize(null)
          return
        }
        setUploadedImage(dataUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process image")
        setUploadedImage(null)
        setFileSize(null)
      } finally {
        setIsPreparingImage(false)
      }
    })()
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleGenerate = async () => {
    // Prevent duplicate submissions
    if (isLoading || isPreparingImage) {
      return
    }

    setError(null)
    setPromptError(null)
    setResult("")
    setResultImages([])

    // Validate prompt
    if (!prompt.trim()) {
      setPromptError("Please enter a prompt to describe your desired edits.")
      return
    }

    if (prompt.trim().length < 3) {
      setPromptError("Prompt is too short. Please provide more details.")
      return
    }

    if (prompt.trim().length > 1000) {
      setPromptError("Prompt is too long. Please keep it under 1000 characters.")
      return
    }

    if (!supabaseEnabled) {
      setError("Auth is not configured. Please set Supabase env vars.")
      return
    }
    if (!user) {
      setError("Please sign in to generate images.")
      return
    }
    if (!isEntitled) {
      setError("Subscription required. Please upgrade on /pricing.")
      return
    }
    if (!canUseModel(tier, selectedModelKey)) {
      setError("This model requires a higher plan. Please upgrade on /pricing.")
      return
    }
    if (!uploadedImage) {
      setError(isPreparingImage ? "Preparing image, please wait..." : "Please upload an image first.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelKey: selectedModelKey,
          prompt,
          imageDataUrl: uploadedImage,
        }),
      })

      const data: unknown = await res.json()
      if (!res.ok) {
        const message =
          typeof data === "object" && data && "error" in data && typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Request failed"
        throw new Error(message)
      }

      const text =
        typeof data === "object" && data && "text" in data && typeof (data as { text?: unknown }).text === "string"
          ? (data as { text: string }).text
          : ""

      const images =
        typeof data === "object" && data && "images" in data && Array.isArray((data as { images?: unknown }).images)
          ? (data as { images: unknown[] }).images.filter((v): v is string => typeof v === "string" && v.length > 0)
          : []

      setResult(text)
      setResultImages(images)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error('[Generator Error]', errorMessage, err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section 
      id="generator" 
      className="px-4 py-16 sm:px-6 sm:py-24"
      aria-label="Image generator"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-3 sm:mb-4">Get Started</h2>
          <p className="text-base sm:text-lg text-muted-foreground">Try The AI Editor</p>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          {/* Left Panel - Controls */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="mb-4 text-lg sm:text-xl font-semibold sm:mb-6">Prompt Engine</h3>
            <p className="mb-4 text-xs sm:text-sm text-muted-foreground sm:mb-6">Transform your image with AI-powered editing</p>

            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                {supabaseEnabled ? (
                  user ? (
                    isBillingLoading ? (
                      <p className="text-muted-foreground">Checking subscription...</p>
                    ) : isEntitled ? (
                      <p>
                        Access: <span className="font-medium">Active</span>{" "}
                        {planKey ? <span className="text-muted-foreground">({planKey})</span> : null}
                      </p>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-muted-foreground">Subscription required.</p>
                        <Button size="sm" asChild>
                          <Link href="/pricing">View pricing</Link>
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-muted-foreground">Please sign in to generate.</p>
                      <Button size="sm" asChild>
                        <Link href="/auth/signin/google?next=/">Sign in</Link>
                      </Button>
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground">Supabase env vars not set. Auth disabled.</p>
                )}
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">AI Model Selection</Label>
                <Select value={selectedModelKey} onValueChange={(v) => setSelectedModelKey(v as ModelKey)}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelCatalog().map((m) => {
                      const locked = !canUseModel(tier, m.key)
                      return (
                        <SelectItem key={m.key} value={m.key} disabled={locked}>
                          {m.label}{locked ? " (upgrade)" : ""}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Your plan unlocks different model tiers.
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Reference Image</Label>
                <div className="relative">
                  <input 
                    id="image" 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <label
                    htmlFor="image"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 ${
                      isDragActive
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="w-full space-y-3">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Preview of uploaded image for AI editing"
                          className="max-h-48 w-full rounded-lg object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                        {fileSize && (
                          <p className="text-center text-xs text-muted-foreground">
                            {(fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className={`mx-auto mb-2 h-8 w-8 transition-colors ${
                          isDragActive ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <p className={`text-sm font-medium transition-colors ${
                          isDragActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPEG, PNG, WebP, or GIF (max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">AI Editing Instructions</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPromptBuilder(!showPromptBuilder)}
                    className="text-xs h-7"
                  >
                    {showPromptBuilder ? "✏️ Manual Input" : "🎯 Prompt Builder"}
                  </Button>
                </div>

                {showPromptBuilder ? (
                  <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">Select options to build your prompt automatically:</p>
                    
                    {/* Background Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="background" className="text-xs">Background Scene</Label>
                      <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                        <SelectTrigger id="background" className="h-9 text-xs">
                          <SelectValue placeholder="Choose background..." />
                        </SelectTrigger>
                        <SelectContent>
                          {promptOptions.backgrounds.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Lighting Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="lighting" className="text-xs">Lighting Style</Label>
                      <Select value={selectedLighting} onValueChange={setSelectedLighting}>
                        <SelectTrigger id="lighting" className="h-9 text-xs">
                          <SelectValue placeholder="Choose lighting..." />
                        </SelectTrigger>
                        <SelectContent>
                          {promptOptions.lighting.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Style Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="style" className="text-xs">Photography Style</Label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger id="style" className="h-9 text-xs">
                          <SelectValue placeholder="Choose style..." />
                        </SelectTrigger>
                        <SelectContent>
                          {promptOptions.styles.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quality Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="quality" className="text-xs">Quality Enhancement</Label>
                      <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                        <SelectTrigger id="quality" className="h-9 text-xs">
                          <SelectValue placeholder="Choose quality..." />
                        </SelectTrigger>
                        <SelectContent>
                          {promptOptions.quality.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={buildPromptFromSelections}
                        disabled={
                          (selectedBackground === "none" || !selectedBackground) && 
                          (selectedLighting === "none" || !selectedLighting) && 
                          (selectedStyle === "none" || !selectedStyle) && 
                          (selectedQuality === "none" || !selectedQuality)
                        }
                        className="flex-1 h-8 text-xs"
                      >
                        ✨ Generate Prompt
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetPromptBuilder}
                        className="h-8 text-xs"
                      >
                        🔄 Reset
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    id="prompt"
                    placeholder="Describe your desired image edits, or use the Prompt Builder above for quick options..."
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value)
                      if (promptError) setPromptError(null)
                    }}
                    rows={5}
                    className={`resize-none ${promptError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    aria-invalid={!!promptError}
                    aria-describedby={promptError ? "prompt-error" : undefined}
                  />
                )}

                {promptError && (
                  <p id="prompt-error" className="text-sm text-destructive flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {promptError}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {prompt.length}/1000 characters
                </p>
              </div>

              <Button
                className="w-full tap-target"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading || isPreparingImage || !supabaseEnabled || !user || !isEntitled}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </span>
                ) : isPreparingImage ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing image...
                  </span>
                ) : (
                  "Generate Now"
                )}
              </Button>
            </div>
          </GlassCard>

          {/* Right Panel - Output */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="mb-4 text-lg sm:text-xl font-semibold sm:mb-6">Output Gallery</h3>
            <p className="mb-4 text-xs sm:text-sm text-muted-foreground sm:mb-6">Your ultra-fast AI creations appear here instantly</p>

            <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6">
              {error ? (
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                  </div>
                  {error.includes('file type') || error.includes('too large') ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setError(null)
                        setUploadedImage(null)
                        setFileSize(null)
                      }}
                    >
                      Try Again
                    </Button>
                  ) : null}
                </div>
              ) : resultImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-lg border bg-background">
                    <img 
                      src={resultImages[0]} 
                      alt="AI-generated result image" 
                      className="h-auto w-full object-contain" 
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={resultImages[0]}
                      download={`nano-banana-${Date.now()}.jpg`}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                      Download
                    </a>
                    {result ? (
                      <span className="text-sm text-muted-foreground">Also returned text below.</span>
                    ) : null}
                  </div>
                  {result ? <p className="whitespace-pre-wrap text-sm text-muted-foreground">{result}</p> : null}
                </div>
              ) : result ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium">Model Output</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{result}</p>
                </div>
              ) : (
                <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                  <div className="mb-4 text-6xl">🍌</div>
                  <p className="text-lg font-medium">Ready for instant generation</p>
                  <p className="text-sm text-muted-foreground">Upload an image, enter a prompt, and run.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
