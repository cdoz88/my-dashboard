import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Image as ImageIcon, Download, ZoomIn, MoveHorizontal, MoveVertical } from 'lucide-react';

export default function AvatarMakerModal({ setIsAvatarMakerModalOpen }) {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(new Image());
  const userImgRef = useRef(new Image());

  const [hasUserImage, setHasUserImage] = useState(false);
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(100);

  // Load the default background image immediately
  useEffect(() => {
    bgImgRef.current.crossOrigin = "Anonymous";
    bgImgRef.current.src = '/Team Photos Background.jpg';
    bgImgRef.current.onload = drawCanvas;
  }, []);

  // Redraw whenever the sliders move
  useEffect(() => {
    drawCanvas();
  }, [scale, posX, posY, hasUserImage]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        userImgRef.current.src = event.target.result;
        userImgRef.current.onload = () => {
          setHasUserImage(true);
          drawCanvas();
        };
      };
      reader.readAsDataURL(file);
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

    // 1. Draw Background First
    if (bgImgRef.current.complete && bgImgRef.current.src) {
        ctx.drawImage(bgImgRef.current, 0, 0, w, h);
    } else {
        // Fallback color if background image isn't loaded/found
        ctx.fillStyle = '#0f172a';
        ctx.fill();
    }

    // 2. Draw Foreground (User Image)
    if (hasUserImage && userImgRef.current.complete) {
        const imgW = userImgRef.current.width;
        const imgH = userImgRef.current.height;
        
        // This scaling math perfectly matches your HTML logic
        const maxDimension = h * (scale / 100); 
        const ratio = Math.min(maxDimension / imgW, maxDimension / imgH);
        const dW = imgW * ratio;
        const dH = imgH * ratio;
        
        const centerX = (w * (posX / 100));
        const dx = centerX - (dW / 2);
        
        const bottomY = (h * (posY / 100));
        const dy = bottomY - dH;
        
        ctx.drawImage(userImgRef.current, dx, dy, dW, dH);
    }

    // Restore context (removes clipping mask for future clearRects)
    ctx.restore();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert the canvas to a high-quality PNG
    const dataUrl = canvas.toDataURL('image/png');
    
    // Force direct download
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

        <div className="p-6 flex flex-col items-center gap-6 overflow-y-auto max-h-[70vh]">
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-slate-200 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
              {/* Internal hidden canvas (High Res for export) */}
              <canvas ref={canvasRef} width={800} height={800} className="w-full h-full object-cover" />
              
              {!hasUserImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-white z-10 p-6 text-center">
                     <ImageIcon size={32} className="mb-2 opacity-80" />
                     <p className="text-sm font-bold">Upload your photo to start!</p>
                     <p className="text-[10px] opacity-70 mt-1">Use an image with a transparent background for best results.</p>
                  </div>
              )}
          </div>

          <div className="w-full space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
             
             <div className="flex items-center gap-4">
                 <label className="flex-1 bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 py-2.5 px-4 rounded-lg cursor-pointer transition-colors shadow-sm font-bold text-sm text-center flex items-center justify-center gap-2">
                     <ImageIcon size={16} className="text-indigo-600" />
                     {hasUserImage ? 'Change Photo' : 'Upload Photo'}
                     <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleUpload} />
                 </label>
             </div>

             <div className={`space-y-4 transition-opacity duration-300 ${!hasUserImage ? 'opacity-30 pointer-events-none' : ''}`}>
                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><ZoomIn size={14}/> Image Size</span>
                       <span className="text-indigo-600">{scale}%</span>
                    </label>
                    <input type="range" min="10" max="300" value={scale} onChange={(e) => setScale(e.target.value)} className="w-full accent-indigo-600" />
                 </div>
                 
                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><MoveHorizontal size={14}/> Horizontal Position</span>
                       <span className="text-indigo-600">{posX}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(e.target.value)} className="w-full accent-indigo-600" />
                 </div>

                 <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                       <span className="flex items-center gap-1.5"><MoveVertical size={14}/> Vertical Position</span>
                       <span className="text-indigo-600">{posY}%</span>
                    </label>
                    <input type="range" min="0" max="150" value={posY} onChange={(e) => setPosY(e.target.value)} className="w-full accent-indigo-600" />
                 </div>
             </div>

          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-between gap-3 flex-shrink-0">
          <button type="button" onClick={() => setIsAvatarMakerModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Close</button>
          <button 
             type="button" 
             onClick={handleDownload}
             disabled={!hasUserImage}
             className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors ${hasUserImage ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
             <Download size={18} /> Download Avatar
          </button>
        </div>

      </div>
    </div>
  );
}