// 1. FIRST: Make sure you import useEffect from React at the very top!
import React, { useState, useEffect } from 'react'; 

export default function WeakPage() {
  const [someState, setSomeState] = useState(false);

  // 2. SECOND: Paste this entire block RIGHT HERE. 
  // It must go inside the function, but above the "return" statement.
  useEffect(() => {
    // Look for an existing robots tag
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    
    // If it doesn't exist, create it
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    
    // Tell Google to IGNORE this page (noindex)
    meta.content = "noindex, follow";

    // Clean up when the user leaves this page
    return () => {
      meta.content = "index, follow";
    };
  }, []);


  // 3. THIRD: Your normal page UI stays exactly the same down here!
  return (
    <div className="p-8">
      <h1>This page is weak or under construction.</h1>
      <p>Google will not index this specific page!</p>
    </div>
  );
}