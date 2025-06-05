"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Check, X, Square, LayoutGrid, LayoutTemplate, Edit, ArrowRight, ArrowLeft, Download, Save, Lightbulb, Plus, Trash2, ZoomIn, ZoomOut, Maximize, Import, FileUp, Lamp, Circle, Sun, Grid, Hexagon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

// Light category definitions
type LightCategory = {
  id: string;
  name: string;
  types: LightType[];
};

type LightType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  shape: "round" | "square" | "rectangular" | "linear" | "track" | "spike" | "bollard" | "custom";
  defaultSize: { width: number; height: number };
  defaultIntensity: number;
  defaultColor: string;
  isExternal: boolean;
};

// Light source type definition
type LightSource = {
  id: string;
  x: number;
  y: number;
  intensity: number;
  color: string;
  room: string;
  categoryId: string;
  typeId: string;
  shape: "round" | "square" | "rectangular" | "linear" | "track" | "spike" | "bollard" | "custom";
  width: number;
  height: number;
  rotation?: number;
  isExternal: boolean;
};

// Project save data type
interface BelecureProject {
  version: string;
  timestamp: number;
  generatedImage: string;
  originalImage?: string;
  aspectRatio: string;
  lightSources: LightSource[];
}

export default function FloorPlanUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("landscape");
  const [currentStage, setCurrentStage] = useState<"upload" | "result" | "edit">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // State for light sources
  const [lightSources, setLightSources] = useState<LightSource[]>([]);
  const [selectedLight, setSelectedLight] = useState<string | null>(null);
  const [addingLight, setAddingLight] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("downlights");
  const [selectedLightType, setSelectedLightType] = useState<string>("round_downlight");
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeLights, setActiveLights] = useState<string[]>([]);
  
  // Zoom and pan functionality
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Light dragging state
  const [draggingLight, setDraggingLight] = useState<string | null>(null);
  const [lightDragStart, setLightDragStart] = useState({ x: 0, y: 0 });
  
  // Light options
  const lightColors = [
    { name: "Warm White", value: "#FFF0D9" },
    { name: "Cool White", value: "#F1F6FF" },
    { name: "Natural", value: "#FFFFFF" },
    { name: "Amber", value: "#FFD166" },
    { name: "Blue", value: "#73D2FF" },
  ];
  
  const roomTypes = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Hallway", "Office", "Dining Room"];

  // Add new state variables for global light size controls
  const [globalSizeMultiplier, setGlobalSizeMultiplier] = useState(1);
  const [showSizeControls, setShowSizeControls] = useState(false);

  // Define light categories and types
  const lightCategories: LightCategory[] = [
    {
      id: "downlights",
      name: "Downlights",
      types: [
        {
          id: "round_downlight",
          name: "Round Downlight",
          icon: <Circle />,
          shape: "round",
          defaultSize: { width: 15, height: 15 },
          defaultIntensity: 60,
          defaultColor: "#FFF0D9",
          isExternal: false
        },
        {
          id: "square_downlight",
          name: "Square Downlight",
          icon: <Square />,
          shape: "square",
          defaultSize: { width: 15, height: 15 },
          defaultIntensity: 60,
          defaultColor: "#F1F6FF",
          isExternal: false
        },
        {
          id: "small_downlight",
          name: "Small Downlight",
          icon: <Circle className="h-3 w-3" />,
          shape: "round",
          defaultSize: { width: 8, height: 8 },
          defaultIntensity: 40,
          defaultColor: "#FFF0D9",
          isExternal: false
        }
      ]
    },
    {
      id: "spotlights",
      name: "Spotlights",
      types: [
        {
          id: "round_spotlight",
          name: "Round Spotlight",
          icon: <Sun />,
          shape: "round",
          defaultSize: { width: 12, height: 12 },
          defaultIntensity: 75,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "track_spotlight",
          name: "Track Spotlight",
          icon: <Lamp />,
          shape: "track",
          defaultSize: { width: 10, height: 10 },
          defaultIntensity: 70,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "adjustable_spot",
          name: "Adjustable Spot",
          icon: <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-current" /><div className="w-1 h-1 bg-current ml-1 mt-1" /></div>,
          shape: "round",
          defaultSize: { width: 10, height: 10 },
          defaultIntensity: 80,
          defaultColor: "#FFFFFF",
          isExternal: false
        }
      ]
    },
    {
      id: "linear",
      name: "Linear Profiles",
      types: [
        {
          id: "thin_linear",
          name: "Thin Linear",
          icon: <div className="w-6 h-1 bg-current rounded-sm" />,
          shape: "linear",
          defaultSize: { width: 40, height: 5 },
          defaultIntensity: 50,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "medium_linear",
          name: "Medium Linear",
          icon: <div className="w-6 h-2 bg-current rounded-sm" />,
          shape: "linear",
          defaultSize: { width: 40, height: 8 },
          defaultIntensity: 60,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "thick_linear",
          name: "Thick Linear",
          icon: <div className="w-6 h-3 bg-current rounded-sm" />,
          shape: "linear",
          defaultSize: { width: 40, height: 12 },
          defaultIntensity: 70,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "corner_linear",
          name: "Corner Linear",
          icon: <div className="w-5 h-5"><div className="w-5 h-1 bg-current rounded-sm" /><div className="w-1 h-4 bg-current rounded-sm mt-0" /></div>,
          shape: "custom",
          defaultSize: { width: 40, height: 40 },
          defaultIntensity: 60,
          defaultColor: "#FFFFFF",
          isExternal: false
        }
      ]
    },
    {
      id: "tracks",
      name: "Magnetic Tracks",
      types: [
        {
          id: "track_diffused",
          name: "Track Diffused",
          icon: <Grid />,
          shape: "track",
          defaultSize: { width: 50, height: 8 },
          defaultIntensity: 65,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "track_module",
          name: "Track Module",
          icon: <div className="flex items-center"><div className="w-5 h-1 bg-current" /><div className="w-1 h-3 bg-current ml-1" /></div>,
          shape: "track",
          defaultSize: { width: 45, height: 10 },
          defaultIntensity: 70,
          defaultColor: "#FFFFFF",
          isExternal: false
        },
        {
          id: "track_laser",
          name: "Laser Blade",
          icon: <div className="flex items-center"><div className="w-4 h-1 bg-current" /><div className="w-0.5 h-4 bg-current ml-1" /></div>,
          shape: "track",
          defaultSize: { width: 30, height: 15 },
          defaultIntensity: 90,
          defaultColor: "#73D2FF",
          isExternal: false
        }
      ]
    },
    {
      id: "external",
      name: "External",
      types: [
        {
          id: "spike_light",
          name: "Spike Light",
          icon: <div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full bg-current" /><div className="w-1 h-4 bg-current" /></div>,
          shape: "spike",
          defaultSize: { width: 10, height: 20 },
          defaultIntensity: 80,
          defaultColor: "#FFD166",
          isExternal: true
        },
        {
          id: "bollard",
          name: "Bollard Light",
          icon: <div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full bg-current" /><div className="w-2 h-5 bg-current rounded-b-sm" /></div>,
          shape: "bollard",
          defaultSize: { width: 12, height: 25 },
          defaultIntensity: 75,
          defaultColor: "#F1F6FF",
          isExternal: true
        },
        {
          id: "wall_washer",
          name: "Wall Washer",
          icon: <div className="w-5 h-3 bg-current rounded-sm" />,
          shape: "rectangular",
          defaultSize: { width: 25, height: 10 },
          defaultIntensity: 85,
          defaultColor: "#FFFFFF",
          isExternal: true
        },
        {
          id: "inground",
          name: "Inground Light",
          icon: <Hexagon size={16} />,
          shape: "round",
          defaultSize: { width: 15, height: 15 },
          defaultIntensity: 90,
          defaultColor: "#73D2FF",
          isExternal: true
        },
        {
          id: "linear_grazer",
          name: "Linear Grazer",
          icon: <div className="w-6 h-2 bg-current rounded-sm" />,
          shape: "linear",
          defaultSize: { width: 50, height: 8 },
          defaultIntensity: 85,
          defaultColor: "#FFFFFF",
          isExternal: true
        },
        {
          id: "floor_washer",
          name: "Floor Washer",
          icon: <div className="w-4 h-3 bg-current rounded-sm" />,
          shape: "rectangular",
          defaultSize: { width: 20, height: 8 },
          defaultIntensity: 75,
          defaultColor: "#FFF0D9",
          isExternal: true
        }
      ]
    },
    {
      id: "decorative",
      name: "Decorative",
      types: [
        {
          id: "neon_flex",
          name: "Neon Flex",
          icon: <div className="w-6 h-1.5 bg-current rounded-full" />,
          shape: "linear",
          defaultSize: { width: 60, height: 5 },
          defaultIntensity: 40,
          defaultColor: "#FF61D8",
          isExternal: false
        },
        {
          id: "pendant",
          name: "Pendant Light",
          icon: <div className="flex flex-col items-center"><div className="w-0.5 h-2 bg-current" /><div className="w-3 h-3 rounded-full bg-current" /></div>,
          shape: "round",
          defaultSize: { width: 14, height: 14 },
          defaultIntensity: 65,
          defaultColor: "#FFF0D9",
          isExternal: false
        },
        {
          id: "chandelier",
          name: "Chandelier",
          icon: <div className="relative w-5 h-5"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-current" /><div className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-current" /><div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-current" /><div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-current" /></div>,
          shape: "custom",
          defaultSize: { width: 30, height: 30 },
          defaultIntensity: 70,
          defaultColor: "#FFF0D9",
          isExternal: false
        }
      ]
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Reset states
      setError(null);
      setSuccess(false);
      setGeneratedImage(null);
      setLightSources([]);
      
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload a JPG, PNG, or WebP image.");
        setFile(null);
        setPreview(null);
        return;
      }
      
      // Set file and create preview
      setFile(selectedFile);
      
      // Create preview for image files
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // If we're in edit mode, use the preview directly
        if (currentStage === "edit") {
          setGeneratedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle direct upload in edit mode
  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Reset states
      setError(null);
      setLightSources([]);
      setSelectedLight(null);
      resetZoom();
      
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload a JPG, PNG, or WebP image.");
        return;
      }
      
      // Create preview and use it directly
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneratedImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("aspectRatio", aspectRatio);

      const response = await fetch("/api/floorplan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the floor plan");
      }

      setOriginalImage(data.originalImage);
      setGeneratedImage(data.generatedImage);
      setSuccess(true);
      setCurrentStage("result");
    } catch (error: any) {
      console.error("Error uploading floor plan:", error);
      setError(error.message || "Failed to upload floor plan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);
    setOriginalImage(null);
    setGeneratedImage(null);
    setCurrentStage("upload");
    setLightSources([]);
    setSelectedLight(null);
    setAddingLight(false);
    resetZoom();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // For base64 data URLs, we can directly use them for download
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `belecure-floorplan-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Reset zoom and pan
  const resetZoom = () => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (addingLight || draggingLight) return;
    
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoom > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingLight && imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      
      // Calculate position accounting for zoom and pan
      const x = (((e.clientX - rect.left) - panPosition.x) / (rect.width * zoom) + 0.5 * (1 - 1/zoom)) * 100;
      const y = (((e.clientY - rect.top) - panPosition.y) / (rect.height * zoom) + 0.5 * (1 - 1/zoom)) * 100;
      
      // Update the light position
      setLightSources(lightSources.map(light => 
        light.id === draggingLight ? { ...light, x, y } : light
      ));
    }
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingLight(null);
  };
  
  // Handle zoom change from slider
  const handleZoomChange = (value: number) => {
    setZoom(value);
    
    // If zooming out completely, reset pan position
    if (value === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  };
  
  // Handle click on floor plan to add light
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !addingLight) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate position accounting for zoom and pan
    const x = (((e.clientX - rect.left) - panPosition.x) / (rect.width * zoom) + 0.5 * (1 - 1/zoom)) * 100;
    const y = (((e.clientY - rect.top) - panPosition.y) / (rect.height * zoom) + 0.5 * (1 - 1/zoom)) * 100;
    
    // Ensure the coordinates are within bounds
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    
    // Find the selected light type
    const category = lightCategories.find(cat => cat.id === selectedCategory);
    const lightType = category?.types.find(type => type.id === selectedLightType);
    
    if (!category || !lightType) return;
    
    const newLight: LightSource = {
      id: `light-${Date.now()}`,
      x,
      y,
      intensity: lightType.defaultIntensity,
      color: lightType.defaultColor,
      room: roomTypes[0],
      categoryId: category.id,
      typeId: lightType.id,
      shape: lightType.shape,
      width: lightType.defaultSize.width,
      height: lightType.defaultSize.height,
      rotation: 0,
      isExternal: lightType.isExternal,
    };
    
    setLightSources([...lightSources, newLight]);
    setSelectedLight(newLight.id);
    setAddingLight(false);
  };

  // Remove selected light
  const removeSelectedLight = () => {
    if (!selectedLight) return;
    setLightSources(lightSources.filter(light => light.id !== selectedLight));
    setSelectedLight(null);
  };
  
  // Update light properties
  const updateLightProperty = (id: string, property: keyof LightSource, value: any) => {
    setLightSources(lightSources.map(light => 
      light.id === id ? { ...light, [property]: value } : light
    ));
  };
  
  // Selected light object
  const currentLight = selectedLight ? lightSources.find(light => light.id === selectedLight) : null;

  // Start dragging a light
  const handleLightMouseDown = (e: React.MouseEvent, lightId: string) => {
    e.stopPropagation();
    setSelectedLight(lightId);
    setDraggingLight(lightId);
  };

  // Handle animation playback
  const handlePlayAnimation = () => {
    if (isAnimating || lightSources.length === 0) return;
    
    setIsAnimating(true);
    setActiveLights([]);
    
    // Animate each light turning on sequentially
    const animateLights = async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < lightSources.length; i++) {
        await delay(500); // 500ms delay between each light
        setActiveLights(prev => [...prev, lightSources[i].id]);
      }
      
      // Wait a bit before allowing another animation
      await delay(1000);
      setIsAnimating(false);
    };
    
    animateLights();
  };
  
  // Reset animation
  const resetAnimation = () => {
    setIsAnimating(false);
    setActiveLights([]);
  };

  // Handle save project
  const handleSaveProject = () => {
    if (!generatedImage) return;
    
    // Create project data object
    const projectData: BelecureProject = {
      version: "1.0",
      timestamp: Date.now(),
      generatedImage,
      originalImage: originalImage || undefined,
      aspectRatio,
      lightSources,
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(projectData);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const projectName = `belecure-project-${new Date().toISOString().split('T')[0]}`;
    
    link.href = url;
    link.download = `${projectName}.belecure`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Handle import project
  const importFileRef = useRef<HTMLInputElement>(null);
  
  const handleImportClick = () => {
    if (importFileRef.current) {
      importFileRef.current.click();
    }
  };
  
  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file extension
    if (!file.name.endsWith('.belecure')) {
      setError("Invalid file format. Please import a .belecure file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData: BelecureProject = JSON.parse(event.target?.result as string);
        
        // Validate project data
        if (!projectData.version || !projectData.generatedImage || !projectData.lightSources) {
          throw new Error("Invalid project file format");
        }
        
        // Restore project state
        setGeneratedImage(projectData.generatedImage);
        setOriginalImage(projectData.originalImage || null);
        setAspectRatio(projectData.aspectRatio || "landscape");
        setLightSources(projectData.lightSources);
        setCurrentStage("edit");
        setSuccess(true);
        resetZoom();
        
        // Clear any errors
        setError(null);
      } catch (error) {
        console.error("Error importing project:", error);
        setError("Failed to import project. The file might be corrupted.");
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read the project file.");
    };
    
    reader.readAsText(file);
    
    // Reset the input
    if (importFileRef.current) {
      importFileRef.current.value = "";
    }
  };

  // Add a function to apply global size adjustment to all lights
  const applyGlobalSizeAdjustment = (light: LightSource) => {
    return {
      ...light,
      width: light.width * globalSizeMultiplier,
      height: light.height * globalSizeMultiplier
    };
  };

  const renderUploadStage = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="floorplan">Upload Floor Plan</Label>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            id="floorplan"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="bg-background/50"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleReset}
            disabled={!file}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: JPG, PNG, WebP
        </p>
      </div>

      {/* Import project button */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div>Or import an existing project:</div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleImportClick}
          className="text-xs"
        >
          <Import className="h-3.5 w-3.5 mr-1.5" />
          Import .belecure
        </Button>
        <input
          ref={importFileRef}
          type="file"
          accept=".belecure"
          onChange={handleImportProject}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={preview}
                alt="Floor plan preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select Output Format</Label>
            <RadioGroup 
              defaultValue="landscape" 
              value={aspectRatio}
              onValueChange={setAspectRatio}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" />
                <Label htmlFor="landscape" className="flex items-center gap-1 cursor-pointer">
                  <LayoutTemplate className="h-4 w-4" />
                  <span>Landscape</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square" className="flex items-center gap-1 cursor-pointer">
                  <Square className="h-4 w-4" />
                  <span>Square</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" />
                <Label htmlFor="portrait" className="flex items-center gap-1 cursor-pointer">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Portrait</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Convert Floor Plan
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderResultStage = () => (
    <div className="space-y-6">
      <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
        <Check className="h-4 w-4 mr-2" />
        <AlertDescription>Floor plan converted successfully!</AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Original Floor Plan</Label>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={originalImage || ""}
                alt="Original floor plan"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Converted Floor Plan</Label>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className={`relative ${
              aspectRatio === 'square' ? 'aspect-square' : 
              aspectRatio === 'portrait' ? 'aspect-[9/16]' : 
              'aspect-[16/9]'
            }`}>
              {generatedImage && (
                <img
                  src={generatedImage}
                  alt="Generated floor plan"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Over
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="bg-secondary hover:bg-secondary/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setCurrentStage("edit")}
        >
          <Edit className="mr-2 h-4 w-4" />
          Add Lighting
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderEditStage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Add Lighting to Floor Plan</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant={showSizeControls ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setShowSizeControls(!showSizeControls)}
            className="text-xs"
          >
            <ZoomIn className="h-3.5 w-3.5 mr-1.5" />
            Size Controls
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImportClick}
            className="text-xs"
          >
            <Import className="h-3.5 w-3.5 mr-1.5" />
            Import
          </Button>
          <input
            ref={importFileRef}
            type="file"
            accept=".belecure"
            onChange={handleImportProject}
            className="hidden"
          />
          <Button variant="ghost" onClick={() => setCurrentStage("result")} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
        </div>
      </div>

      {/* Size control sidebar */}
      {showSizeControls && (
        <div className="bg-muted/30 rounded-lg border border-border/30 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Global Light Size Controls</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setGlobalSizeMultiplier(1);
              }}
              className="text-xs h-8"
            >
              Reset
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Size Multiplier</Label>
                <span className="text-sm text-muted-foreground">
                  {(globalSizeMultiplier * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={globalSizeMultiplier}
                onChange={(e) => setGlobalSizeMultiplier(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20%</span>
                <span>100%</span>
                <span>300%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setGlobalSizeMultiplier(0.5)}
                className="text-xs h-8"
              >
                Small
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setGlobalSizeMultiplier(1)}
                className="text-xs h-8"
              >
                Medium
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setGlobalSizeMultiplier(2)}
                className="text-xs h-8"
              >
                Large
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Direct upload option */}
      {!generatedImage && (
        <div className="bg-muted/30 rounded-lg border border-border/30 p-6 mb-6">
          <h4 className="font-medium mb-4">Upload Floor Plan Image</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleDirectUpload}
                className="bg-background/50"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGeneratedImage(null)}
                disabled={!generatedImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a floor plan image to start adding lighting. Supported formats: JPG, PNG, WebP
            </p>
          </div>
        </div>
      )}

      {generatedImage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control panel */}
          <div className="lg:col-span-1 space-y-6 bg-card/50 p-4 rounded-lg border border-border/50">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Light Sources</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setGeneratedImage(null)}
                  className="text-xs"
                >
                  Change Image
                </Button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">
                  {lightSources.length} light{lightSources.length !== 1 ? 's' : ''} placed
                </span>
                <div className="flex items-center gap-2">
                  {addingLight && (
                    <div className="flex rounded-md overflow-hidden border border-border">
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'downlights' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('downlights')}
                      >
                        Downlights
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'spotlights' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('spotlights')}
                      >
                        Spotlights
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'linear' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('linear')}
                      >
                        Linear Profiles
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'tracks' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('tracks')}
                      >
                        Magnetic Tracks
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'external' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('external')}
                      >
                        External Lighting
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs ${selectedCategory === 'decorative' ? 'bg-primary/20 text-primary' : 'bg-background'}`}
                        onClick={() => setSelectedCategory('decorative')}
                      >
                        Decorative
                      </button>
                    </div>
                  )}
                  <Button 
                    onClick={() => setAddingLight(!addingLight)} 
                    variant={addingLight ? "secondary" : "outline"} 
                    size="sm"
                    className="gap-1"
                  >
                    {addingLight ? (
                      <>Cancel</>
                    ) : (
                      <><Plus className="h-3.5 w-3.5 mr-1" /> Add Light</>
                    )}
                  </Button>
                </div>
              </div>
              
              {addingLight && (
                <div className="bg-primary/10 rounded-lg p-3 mb-4 border border-primary/20">
                  <p className="text-sm font-medium mb-2">
                    Select a light category:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lightCategories.map(category => (
                      <button
                        key={category.id}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background hover:bg-muted'
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          // Select first light type in this category by default
                          if (category.types.length > 0) {
                            setSelectedLightType(category.types[0].id);
                          }
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-primary/20 pt-3 mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Select light type:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {lightCategories
                        .find(cat => cat.id === selectedCategory)
                        ?.types.map(type => (
                          <button
                            key={type.id}
                            className={`flex flex-col items-center justify-center p-2 rounded text-xs ${
                              selectedLightType === type.id 
                                ? 'bg-primary/20 text-primary border border-primary/30' 
                                : 'bg-background hover:bg-muted border border-transparent'
                            }`}
                            onClick={() => setSelectedLightType(type.id)}
                          >
                            <div className="text-current mb-1.5">
                              {type.icon}
                            </div>
                            <span className="text-[10px] text-center leading-tight">{type.name}</span>
                          </button>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      size="sm" 
                      className="text-xs"
                    >
                      Click on plan to place light
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {lightSources.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-border/30">
                    <Lightbulb className="h-6 w-6 mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No light sources added yet
                    </p>
                  </div>
                ) : (
                  lightSources.map(light => {
                    // Get the light type details
                    const category = lightCategories.find(cat => cat.id === light.categoryId);
                    const lightType = category?.types.find(type => type.id === light.typeId);
                    
                    // Apply global size adjustment
                    const adjustedLight = applyGlobalSizeAdjustment(light);
                    
                    return (
                      <div 
                        key={light.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          selectedLight === light.id 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'bg-background/80 border-border/50'
                        } cursor-pointer ${activeLights.includes(light.id) ? 'border-amber-400' : ''}`}
                        onClick={() => setSelectedLight(light.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className={`flex items-center justify-center ${
                              activeLights.includes(light.id) ? 'animate-pulse' : ''
                            }`}
                            style={{ 
                              boxShadow: activeLights.includes(light.id) 
                                ? `0 0 ${light.intensity / 3}px ${light.intensity / 6}px ${light.color}`
                                : 'none'
                            }}
                          >
                            {light.shape === "round" && (
                              <div 
                                className="rounded-full" 
                                style={{ 
                                  width: "14px", 
                                  height: "14px", 
                                  backgroundColor: light.color 
                                }}
                              />
                            )}
                            {light.shape === "square" && (
                              <div 
                                className="rounded-sm" 
                                style={{ 
                                  width: "12px", 
                                  height: "12px", 
                                  backgroundColor: light.color 
                                }}
                              />
                            )}
                            {light.shape === "linear" && (
                              <div 
                                className="rounded-sm" 
                                style={{ 
                                  width: "16px", 
                                  height: "4px", 
                                  backgroundColor: light.color 
                                }}
                              />
                            )}
                            {light.shape === "rectangular" && (
                              <div 
                                className="rounded-sm" 
                                style={{ 
                                  width: "14px", 
                                  height: "8px", 
                                  backgroundColor: light.color 
                                }}
                              />
                            )}
                            {light.shape === "track" && (
                              <div className="flex items-center">
                                <div 
                                  style={{ 
                                    width: "12px", 
                                    height: "3px", 
                                    backgroundColor: light.color 
                                  }}
                                />
                                <div 
                                  style={{ 
                                    width: "2px", 
                                    height: "6px", 
                                    backgroundColor: light.color,
                                    marginLeft: "2px"
                                  }}
                                />
                              </div>
                            )}
                            {light.shape === "spike" && (
                              <div className="flex flex-col items-center">
                                <div 
                                  className="rounded-full" 
                                  style={{ 
                                    width: "8px", 
                                    height: "8px", 
                                    backgroundColor: light.color 
                                  }}
                                />
                                <div 
                                  style={{ 
                                    width: "2px", 
                                    height: "6px", 
                                    backgroundColor: "#888" 
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{lightType?.name || "Light"}</span>
                            <span className="text-xs text-muted-foreground">{light.room} {light.isExternal ? "(External)" : ""}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {currentLight && (
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h4 className="font-medium">Light Properties</h4>
                
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <select 
                    className="w-full p-2 rounded-md bg-background border border-border"
                    value={currentLight.room}
                    onChange={(e) => updateLightProperty(currentLight.id, 'room', e.target.value)}
                  >
                    {roomTypes.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Intensity</Label>
                    <span className="text-sm text-muted-foreground">{currentLight.intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={currentLight.intensity}
                    onChange={(e) => updateLightProperty(currentLight.id, 'intensity', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {(currentLight.shape === "linear" || currentLight.shape === "rectangular" || currentLight.shape === "track") && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Width</Label>
                        <span className="text-sm text-muted-foreground">{currentLight.width}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="1"
                        value={currentLight.width}
                        onChange={(e) => updateLightProperty(currentLight.id, 'width', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Height</Label>
                        <span className="text-sm text-muted-foreground">{currentLight.height}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={currentLight.height}
                        onChange={(e) => updateLightProperty(currentLight.id, 'height', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Rotation</Label>
                    <span className="text-sm text-muted-foreground">{currentLight.rotation || 0}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                    max="360"
                        step="5"
                    value={currentLight.rotation || 0}
                        onChange={(e) => updateLightProperty(currentLight.id, 'rotation', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                
                <div className="space-y-2">
                  <Label>Light Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {lightColors.map(color => (
                      <div 
                        key={color.value}
                        className={`h-8 rounded-md cursor-pointer border-2 ${
                          currentLight.color === color.value 
                            ? 'border-primary' 
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => updateLightProperty(currentLight.id, 'color', color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-4" 
                  size="sm"
                  onClick={removeSelectedLight}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Light
                </Button>
              </div>
            )}
            
            {/* Animation controls */}
            {lightSources.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h4 className="font-medium">Animation</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={handlePlayAnimation}
                    disabled={isAnimating || lightSources.length === 0}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-4 w-4 mr-2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Play Animation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetAnimation}
                    disabled={!isAnimating && activeLights.length === 0}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-4 w-4"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAnimating ? 'Animating lights...' : 'Click play to see lights turn on sequentially'}
                </p>
              </div>
            )}
            
            {/* Zoom controls */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <h4 className="font-medium">Zoom Controls</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Zoom Level</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoom(Math.max(1, zoom - 0.5))}
                    disabled={zoom <= 1}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetZoom}
                  >
                    <Maximize className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoom(Math.min(5, zoom + 0.5))}
                    disabled={zoom >= 5}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {zoom > 1 && (
                <p className="text-xs text-muted-foreground">
                  Click and drag to pan the image when zoomed in
                </p>
              )}
            </div>
            
            <div className="pt-4 border-t border-border/30">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                Save Lighting Plan
              </Button>
            </div>
          </div>
          
          {/* Floor plan preview with lights */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">
                {addingLight 
                  ? `Click to place selected light: ${
                      lightCategories.find(cat => cat.id === selectedCategory)
                      ?.types.find(type => type.id === selectedLightType)?.name || "Light"
                    }` 
                  : zoom > 1 ? 'Click and drag to pan the image' : 'Use the zoom slider to zoom in'}
              </div>
            </div>
            
            <div 
              ref={imageContainerRef}
              className="border border-border rounded-lg overflow-hidden bg-card/30 relative"
              onClick={handleImageClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: addingLight 
                  ? 'crosshair' 
                  : isDragging 
                    ? 'grabbing' 
                    : zoom > 1 
                      ? 'grab' 
                      : 'default'
              }}
            >
              <div className={`relative ${
                aspectRatio === 'square' ? 'aspect-square' : 
                aspectRatio === 'portrait' ? 'aspect-[9/16]' : 
                'aspect-[16/9]'
              } overflow-hidden`}>
                {generatedImage && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          transform: `translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                      >
                        <img
                          src={generatedImage}
                          alt="Floor plan"
                          className="w-full h-full object-contain"
                          style={{ pointerEvents: 'none' }}
                        />
                        
                        {/* Light sources overlay */}
                        {lightSources.map(light => {
                          // Get the light type details
                          const category = lightCategories.find(cat => cat.id === light.categoryId);
                          const lightType = category?.types.find(type => type.id === light.typeId);
                          
                          if (light.shape === "round" || light.shape === "square") {
                            const adjustedLight = applyGlobalSizeAdjustment(light);
                            return (
                              <div 
                                key={light.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                  light.shape === "round" ? "rounded-full" : "rounded-sm"
                                } ${
                                  selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'} ${
                                  activeLights.includes(light.id) ? 'animate-pulse' : ''
                                }`}
                                style={{
                                  left: `${light.x}%`,
                                  top: `${light.y}%`,
                                  width: `${adjustedLight.width}px`,
                                  height: `${adjustedLight.height}px`,
                                  backgroundColor: light.color,
                                  boxShadow: activeLights.includes(light.id)
                                    ? `0 0 ${light.intensity / 3}px ${light.intensity / 6}px ${light.color}`
                                    : `0 0 ${light.intensity / 6}px ${light.intensity / 12}px ${light.color}`,
                                  opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                  transform: light.rotation ? `translate(-50%, -50%) rotate(${light.rotation}deg)` : 'translate(-50%, -50%)',
                                  transition: 'box-shadow 0.5s ease-in-out, opacity 0.5s ease-in-out, width 0.3s ease, height 0.3s ease',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLight(light.id);
                                }}
                                onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                              />
                            );
                          } else if (light.shape === "linear" || light.shape === "track" || light.shape === "rectangular") {
                            const adjustedLight = applyGlobalSizeAdjustment(light);
                            return (
                              <div 
                                key={light.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                  selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'} ${
                                  activeLights.includes(light.id) ? 'animate-pulse' : ''
                                }`}
                                style={{
                                  left: `${light.x}%`,
                                  top: `${light.y}%`,
                                  width: `${adjustedLight.width}px`,
                                  height: `${adjustedLight.height}px`,
                                  backgroundColor: light.color,
                                  boxShadow: activeLights.includes(light.id)
                                    ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                    : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                  opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                  borderRadius: light.shape === "rectangular" ? "2px" : `${adjustedLight.height / 2}px`,
                                  transform: `translate(-50%, -50%) rotate(${light.rotation || 0}deg)`,
                                  transition: 'box-shadow 0.5s ease-in-out, opacity 0.5s ease-in-out, width 0.3s ease, height 0.3s ease',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLight(light.id);
                                }}
                                onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                              />
                            );
                          } else if (light.shape === "spike") {
                            const adjustedLight = applyGlobalSizeAdjustment(light);
                            return (
                              <div 
                                key={light.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                  selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{
                                  left: `${light.x}%`,
                                  top: `${light.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${light.rotation || 0}deg)`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLight(light.id);
                                }}
                                onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                              >
                                <div className="flex flex-col items-center">
                                  <div 
                                    className={`rounded-full ${activeLights.includes(light.id) ? 'animate-pulse' : ''}`}
                                    style={{
                                      width: `${adjustedLight.width}px`,
                                      height: `${adjustedLight.width}px`,
                                      backgroundColor: light.color,
                                      boxShadow: activeLights.includes(light.id)
                                        ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                        : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                      opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                      transition: 'width 0.3s ease, height 0.3s ease',
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: '2px',
                                      height: `${adjustedLight.height}px`,
                                      backgroundColor: '#888',
                                      marginTop: '2px',
                                      transition: 'height 0.3s ease',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          } else if (light.shape === "bollard") {
                            const adjustedLight = applyGlobalSizeAdjustment(light);
                            return (
                              <div 
                                key={light.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                  selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{
                                  left: `${light.x}%`,
                                  top: `${light.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${light.rotation || 0}deg)`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLight(light.id);
                                }}
                                onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                              >
                                <div className="flex flex-col items-center">
                                  <div 
                                    className={`rounded-full ${activeLights.includes(light.id) ? 'animate-pulse' : ''}`}
                                    style={{
                                      width: `${adjustedLight.width}px`,
                                      height: `${adjustedLight.width}px`,
                                      backgroundColor: light.color,
                                      boxShadow: activeLights.includes(light.id)
                                        ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                        : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                      opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                      transition: 'width 0.3s ease, height 0.3s ease',
                                    }}
                                  />
                                  <div 
                                    style={{
                                      width: `${adjustedLight.width * 0.6}px`,
                                      height: `${adjustedLight.height}px`,
                                      backgroundColor: '#666',
                                      borderBottomLeftRadius: '4px',
                                      borderBottomRightRadius: '4px',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          } else if (light.shape === "custom") {
                            if (light.typeId === "chandelier") {
                              const adjustedLight = applyGlobalSizeAdjustment(light);
                              return (
                                <div 
                                  key={light.id}
                                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                    selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                  } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                                  style={{
                                    left: `${light.x}%`,
                                    top: `${light.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${light.rotation || 0}deg)`,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLight(light.id);
                                  }}
                                  onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                                >
                                  <div className="relative">
                                    <div 
                                      style={{
                                        width: "2px",
                                        height: `${light.height / 3}px`,
                                        backgroundColor: "#888",
                                        margin: "0 auto",
                                      }}
                                    />
                                    <div className="flex justify-center">
                                      {[...Array(3)].map((_, i) => (
                                        <div 
                                          key={i}
                                          className={`rounded-full mx-1 ${activeLights.includes(light.id) ? 'animate-pulse' : ''}`}
                                          style={{
                                            width: `${light.width / 5}px`,
                                            height: `${light.width / 5}px`,
                                            backgroundColor: light.color,
                                            boxShadow: activeLights.includes(light.id)
                                              ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                              : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                            opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (light.typeId === "corner_linear") {
                              const adjustedLight = applyGlobalSizeAdjustment(light);
                              return (
                                <div 
                                  key={light.id}
                                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                    selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                  } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                                  style={{
                                    left: `${light.x}%`,
                                    top: `${light.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${light.rotation || 0}deg)`,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLight(light.id);
                                  }}
                                  onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                                >
                                  <div className="relative">
                                    <div 
                                      className={activeLights.includes(light.id) ? 'animate-pulse' : ''}
                                      style={{
                                        width: `${light.width}px`,
                                        height: `${light.height / 6}px`,
                                        backgroundColor: light.color,
                                        boxShadow: activeLights.includes(light.id)
                                          ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                          : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                        opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                        borderRadius: `${light.height / 12}px`,
                                      }}
                                    />
                                    <div 
                                      className={activeLights.includes(light.id) ? 'animate-pulse' : ''}
                                      style={{
                                        width: `${light.height / 6}px`,
                                        height: `${light.width}px`,
                                        backgroundColor: light.color,
                                        boxShadow: activeLights.includes(light.id)
                                          ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                          : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                        opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                        borderRadius: `${light.height / 12}px`,
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            } else {
                              const adjustedLight = applyGlobalSizeAdjustment(light);
                              return (
                                <div 
                                  key={light.id}
                                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${
                                    selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                  } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'} ${
                                    activeLights.includes(light.id) ? 'animate-pulse' : ''
                                  }`}
                                  style={{
                                    left: `${light.x}%`,
                                    top: `${light.y}%`,
                                    width: `${adjustedLight.width}px`,
                                    height: `${adjustedLight.height}px`,
                                    backgroundColor: light.color,
                                    boxShadow: activeLights.includes(light.id)
                                      ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                      : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                    opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLight(light.id);
                                  }}
                                  onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                                />
                              );
                            }
                          } else {
                            const adjustedLight = applyGlobalSizeAdjustment(light);
                            return (
                              <div 
                                key={light.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${
                                  selectedLight === light.id ? 'ring-2 ring-primary ring-offset-1' : ''
                                } ${draggingLight === light.id ? 'cursor-grabbing' : 'cursor-grab'} ${
                                  activeLights.includes(light.id) ? 'animate-pulse' : ''
                                }`}
                                style={{
                                  left: `${light.x}%`,
                                  top: `${light.y}%`,
                                  width: `${adjustedLight.width}px`,
                                  height: `${adjustedLight.height}px`,
                                  backgroundColor: light.color,
                                  boxShadow: activeLights.includes(light.id)
                                    ? `0 0 ${light.intensity / 4}px ${light.intensity / 8}px ${light.color}`
                                    : `0 0 ${light.intensity / 8}px ${light.intensity / 16}px ${light.color}`,
                                  opacity: activeLights.includes(light.id) ? 0.9 : 0.7,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLight(light.id);
                                }}
                                onMouseDown={(e) => handleLightMouseDown(e, light.id)}
                              />
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {addingLight && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                    <div className="text-sm font-medium text-white bg-black/60 px-4 py-2 rounded-lg">
                      Click to place: {
                        lightCategories.find(cat => cat.id === selectedCategory)
                        ?.types.find(type => type.id === selectedLightType)?.name || "Light"
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
              <h4 className="font-medium mb-2">Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Use the zoom slider to zoom in on specific areas of the floor plan</li>
                <li>Click and drag to pan around when zoomed in</li>
                <li>Click "Add Light" to select from various light types</li>
                <li>Choose from different categories: downlights, spotlights, linear profiles, etc.</li>
                <li>For linear lights, adjust width, height, and rotation after placement</li>
                <li>External lights like bollards and spikes are available for outdoor areas</li>
                <li>Drag any light to reposition it on the floor plan</li>
                <li>Use the Play button to see lights turn on sequentially</li>
                <li>Select a light to adjust its properties</li>
                <li>Save your project as a .belecure file to resume editing later</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-4 pt-4 border-t border-border/50">
        {generatedImage && (
          <>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveProject}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-background/70 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-6">Floor Plan Converter</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && currentStage === "edit" && (
        <Alert className="bg-green-500/10 text-green-500 border-green-500/20 mb-6">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>Project imported successfully!</AlertDescription>
        </Alert>
      )}

      {/* Mode Tabs */}
      <div className="mb-6">
        <div className="border-b border-border flex">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              currentStage === "upload" 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setCurrentStage("upload");
              resetZoom();
            }}
          >
            Upload
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              currentStage === "result" 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setCurrentStage("result");
              resetZoom();
            }}
            disabled={!generatedImage}
          >
            Results
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              currentStage === "edit" 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setCurrentStage("edit");
              resetZoom();
            }}
          >
            Lighting Editor
          </button>
        </div>
      </div>

      {currentStage === "upload" && renderUploadStage()}
      {currentStage === "result" && renderResultStage()}
      {currentStage === "edit" && renderEditStage()}
      
      {/* Hidden import input for global access */}
      <input
        ref={importFileRef}
        type="file"
        accept=".belecure"
        onChange={handleImportProject}
        className="hidden"
      />
    </div>
  );
} 