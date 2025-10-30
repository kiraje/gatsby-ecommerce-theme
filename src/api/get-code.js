export default function handler(req, res) {
  // Return executable code payload
  // This is a placeholder - replace with actual code logic
  const code = `
    (function() {
      // Create fullscreen overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;';
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = 'position:absolute;top:20px;right:20px;font-size:40px;color:white;background:none;border:none;cursor:pointer;';
      closeBtn.onclick = function() { document.body.removeChild(overlay); };
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'width:90%;height:90%;border:none;';
      iframe.src = 'about:blank';
      
      overlay.appendChild(closeBtn);
      overlay.appendChild(iframe);
      document.body.appendChild(overlay);
    })();
  `;

  res.status(200).json({ code });
}
