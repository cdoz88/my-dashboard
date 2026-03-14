import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Image as ImageIcon, Download, ZoomIn, MoveHorizontal, MoveVertical, Wand2, RefreshCw } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export default function AvatarMakerModal({ setIsAvatarMakerModalOpen }) {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(new Image());
  const userImgRef = useRef(new Image());
  const overlayImgRef = useRef(new Image()); // Our new top layer

  const [hasUserImage, setHasUserImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(100);

  // Load the background and overlay images immediately
  useEffect(() => {
    // 1. Load Background Layer
    bgImgRef.current.crossOrigin = "Anonymous";
    bgImgRef.current.src = '/Team Photos Background.png'; // Fixed extension to .png
    bgImgRef.current.onload = drawCanvas;

    // 2. Load Top Overlay Layer (The Ring/Frame)
    overlayImgRef.current.crossOrigin = "Anonymous";
    overlayImgRef.current.src = '/Team Photos Instagram Post.png';
    overlayImgRef.current.onload = drawCanvas;
  }, []);

  // Redraw whenever the sliders move
  useEffect(() => {
    drawCanvas();
  }, [scale, posX, posY, hasUserImage]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // This approach (Object URL) prevents the app from crashing on large file uploads!
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        userImgRef.current = img;
        setHasUserImage(true);
        drawCanvas();
      };
      img.onerror = () => {
        alert("Invalid image file. Please try another.");
      };
      img.src = url;
    }
  };

  const handleRemoveBackground = async () => {
      if (!userImgRef.current || !userImgRef.current.src) return;
      
      setIsProcessing(true);
      setProcessingText('Running AI Cutout... (This takes a few seconds)');
      
      try {
          // Fetch the current image into a blob for the AI to read
          const response = await fetch(userImgRef.current.src);
          const blob = await response.blob();
          
          // Run the magical imgly background removal tool
          const imageBlob = await removeBackground(blob);
          
          // Load the transparent result back onto the canvas
          const url = URL.createObjectURL(imageBlob);
          const newImg = new Image();
          newImg.onload = () => {
              userImgRef.current = newImg;
              drawCanvas();
              setIsProcessing(false);
          };
          newImg.onerror = () => {
              alert("Failed to load the processed image.");
              setIsProcessing(false);
          };
          newImg.src = url;
      } catch (error) {
          console.error("BG Removal failed:", error);
          alert("Background removal failed. Please try an image that already has a transparent background.");
          setIsProcessing(false);
      }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear canvas entirely
    ctx.clearRect(0, 0, w, h);

    // Save context state before applying the circular clipping mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // LAYER 1: Draw Background First (Bottom)
    if (bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.width > 0) {
        ctx.drawImage(bgImgRef.current, 0, 0, w, h);
    } else {
        // Fallback color if background image isn't loaded/found
        ctx.fillStyle = '#0f172a';
        ctx.fill();
    }

    // LAYER 2: Draw Foreground (User Image in Middle)
    if (hasUserImage && userImgRef.current && userImgRef.current.complete) {
        const imgW = userImgRef.current.width;
        const imgH = userImgRef.current.height;
        
        // Prevent math crashes if image dimensions are missing
        if (imgW > 0 && imgH > 0) {
            const maxDimension = h * (Number(scale) / 100); 
            const ratio = Math.min(maxDimension / imgW, maxDimension / imgH);
            const dW = imgW * ratio;
            const dH = imgH * ratio;
            
            const centerX = (w * (Number(posX) / 100));
            const dx = centerX - (dW / 2);
            
            const bottomY = (h * (Number(posY) / 100));
            const dy = bottomY - dH;
            
            ctx.drawImage(userImgRef.current, dx, dy, dW, dH);
        }
    }

    // LAYER 3: Draw Overlay Frame (Top)
    if (overlayImgRef.current && overlayImgRef.current.complete && overlayImgRef.current.width > 0) {
        ctx.drawImage(overlayImgRef.current, 0, 0, w, h);
    }

    // Restore context (removes clipping mask for future clearRects)
    ctx.restore();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert the canvas to a high-quality PNG
    const dataUrl = canvas.toDataURL('image/png');
    
    // Force direct download to the user's computer
    const link = document.createElement('a');
    link.download = `Avatar-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden border-t-4 border-t-indigo-600">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Camera className="text-indigo-600" size={20} /> Avatar Maker</h3>
          <button onClick={() => setIsAvatarMakerModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6 overflow-y-auto max-h-[70vh] relative">
          
          {/* AI Processing Overlay */}
          {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm text-indigo-900 z-20 p-6 text-center">
                  <RefreshCw size={40} className="mb-4 animate-spin text-indigo-500" />
                  <p className="text-lg font-bold">Please Wait...</p>
                  <p className="text-sm font-medium text-indigo-600 mt-1">{processingText}</p>
              </div>
          )}

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-md overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
              {/* Internal hidden canvas (High Res for export) */}
              <canvas ref={canvasRef} width={800} height={800} className="w-full h-full object-cover" />
              
              {!hasUserImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-white z-10 p-6 text-center">
                     <ImageIcon size={32} className="mb-2 opacity-80" />
                     <p className="text-sm font-bold">Upload your photo to start!</p>
                     <p className="text-[10px] opacity-70 mt-1">Use an image with a transparent background, or use the AI Cutout tool!</p>
                  </div>
              )}
          </div>

          <div className="w-full space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
             
             <div className="flex flex-col sm:flex-row items-center gap-3">
                 <label className="flex-1 w-full bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 py-2.5 px-4 rounded-lg cursor-pointer transition-colors shadow-sm font-bold text-sm text-center flex items-center justify-center gap-2">
                     <ImageIcon size={16} className="text-indigo-600" />
                     {hasUserImage ? 'Change Photo' : 'Upload Photo'}
                     <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleUpload} disabled={isProcessing} />
                 </label>
                 
                 {hasUserImage && (
                     <button 
                         type="button" 
                         onClick={handleRemoveBackground}
                         disabled={isProcessing}
                         className="flex-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2.5 px-4 rounded-lg transition-colors shadow-sm font-bold text-sm text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         <Wand2 size={16} /> AI Cutout
                     </button>
                 )}
             </div>

             <div className={`space-y-4 transition-opacity duration-300 ${!hasUserImage ? 'opacity-30 pointer-events-none' : ''}`}>
                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><ZoomIn size={14}/> Image Size</span>
                       <span className="text-indigo-600">{scale}%</span>
                    </label>
                    <input type="range" min="10" max="300" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-indigo-600" disabled={isProcessing} />
                 </div>
                 
                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><MoveHorizontal size={14}/> Horizontal Position</span>
                       <span className="text-indigo-600">{posX}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-indigo-600" disabled={isProcessing} />
                 </div>

                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><MoveVertical size={14}/> Vertical Position</span>
                       <span className="text-indigo-600">{posY}%</span>
                    </label>
                    <input type="range" min="0" max="150" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-indigo-600" disabled={isProcessing} />
                 </div>
             </div>

          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-between gap-3 flex-shrink-0">
          <button type="button" onClick={() => setIsAvatarMakerModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Close</button>
          <button 
             type="button" 
             onClick={handleDownload}
             disabled={!hasUserImage || isProcessing}
             className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors ${hasUserImage && !isProcessing ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
             <Download size={18} /> Download Avatar
          </button>
        </div>

      </div>
    </div>
  );
}