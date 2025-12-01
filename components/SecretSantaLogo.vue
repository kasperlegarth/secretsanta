<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Rød farve + let glow -->
      <linearGradient id="secretSantaRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff2c2c" />
        <stop offset="100%" stop-color="#e00000" />
      </linearGradient>

      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Tekst-gruppe -->
    <g
      fill="url(#secretSantaRed)"
      filter="url(#softGlow)"
      font-family="'Cooper Black', 'Chewy', system-ui, sans-serif"
      font-weight="700"
      text-anchor="middle"
    >
      <text x="50%" y="200" font-size="112">
        Secret
      </text>
      <text x="50%" y="320" font-size="112">
        Santa
      </text>
    </g>

    <!-- Små "jule-stjerner" -->
    <g fill="#ff2c2c">
      <!-- højre for "Secret" -->
      <path d="M410 180l8-18 8 18 18 8-18 8-8 18-8-18-18-8z" />
      <!-- højre for "Santa" -->
      <path d="M410 310l7-16 7 16 16 7-16 7-7 16-7-16-16-7z" />
      <!-- lille stjerne nedenunder -->
      <path d="M250 380l5-11 5 11 11 5-11 5-5 11-5-11-11-5z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [String, Number],
    default: 200
  }
});
</script>
