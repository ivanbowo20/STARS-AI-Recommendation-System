<?php
// STARS Premium SVG Logo
function get_stars_logo($class = "h-10 w-10") {
    return '
    <svg class="' . $class . '" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#D4D4D8" />
          <stop offset="100%" stop-color="#52525B" />
        </linearGradient>
      </defs>
      
      <!-- Soft Ambient Glow -->
      <circle cx="50" cy="50" r="45" fill="url(#logo-glow)" />
      
      <!-- Graduation Cap Diamond (Top) -->
      <path d="M50 26 L82 38 L50 50 L18 38 Z" fill="url(#silver-gradient)" stroke="#FFFFFF" stroke-width="1" />
      
      <!-- "S" shape supporting the cap base, forming a smooth ribbon flow -->
      <path d="M 38 46 Q 38 58, 50 58 T 62 70 Q 62 82, 50 82 C 40 82, 35 77, 35 72" stroke="url(#silver-gradient)" stroke-width="6.5" stroke-linecap="round" fill="none" />
      
      <!-- Graduation Tassel dangling from the right tip -->
      <path d="M82 38 L88 53 L85 64" stroke="#D4D4D8" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <circle cx="85" cy="66" r="2.5" fill="#FFFFFF" />
      
      <!-- Glowing Star crowning the top of the Cap -->
      <path d="M50 6 L52.5 12 L58.5 12 L53.5 16 L55.5 22.5 L50 18.5 L44.5 22.5 L46.5 16 L41.5 12 L47.5 12 Z" fill="#FFFFFF" />
    </svg>';
}
?>
