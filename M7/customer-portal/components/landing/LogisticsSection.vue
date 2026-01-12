<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="/deliveroo-containers.webp"
        alt="Modern European logistics trucks on highway"
        class="w-full h-full object-cover"
      />
      <!-- Green overlay with solid opacity -->
      <div class="absolute inset-0 bg-success-800 opacity-90"></div>
      <!-- Additional dark overlay for text contrast -->
      <div class="absolute inset-0 bg-black opacity-20"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg animate-fade-in opacity-0 animation-delay-300">
          <span class="block animate-slide-up opacity-0 animation-delay-500">Seamless Logistics</span>
          <span class="block text-accent-300 animate-slide-up opacity-0 animation-delay-700">Across Europe</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-100 drop-shadow-md animate-fade-in opacity-0 animation-delay-900">
          Connecting East and West with reliable road transportation and secure warehousing.
          From Poland to every corner of Europe, we deliver excellence.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6 animate-slide-up opacity-0 animation-delay-1100">
          <NuxtLink
            to="/quote"
            class="rounded-md bg-gradient-to-r from-accent-500 to-accent-600 bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-accent-600 hover:to-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 pulse-on-hover"
          >
            Get Quote
          </NuxtLink>
          <a
            href="#services"
            class="rounded-md bg-gradient-to-r from-accent-300 to-accent-400 bg-green-700 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-accent-400 hover:to-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>

    <!-- CRAZY Floating elements with WACKY animations -->
    <div
      ref="truckElement"
      @click="triggerEpicSequence"
      class="absolute top-20 left-8 sm:left-16 md:top-24 lg:top-32 cursor-pointer floating-truck z-50"
      :class="{
        'truck-going-crazy': truckCrazy,
        'floating-around': !truckCrazy && !epicSequenceActive
      }"
      style="transform-origin: center center;"
    >
      <div class="crazy-truck-container bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-xl p-4 shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 hover:scale-125 hover:rotate-12 border-2 border-yellow-300">
        <TruckIcon class="h-8 w-8 text-white drop-shadow-lg animate-wiggle" />
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
    </div>

    <div
      ref="warehouseElement"
      @click="triggerEpicSequence"
      class="absolute bottom-20 right-8 sm:right-16 md:bottom-24 lg:bottom-32 cursor-pointer floating-warehouse z-50"
      :class="{
        'warehouse-going-crazy': warehouseCrazy,
        'floating-around-reverse': !warehouseCrazy && !epicSequenceActive,
        'warehouse-growing': warehouseGrowing,
        'warehouse-exploding-confetti': confettiExploding
      }"
      :style="`transform-origin: center center; transform: scale(${warehouseScale});`"
    >
      <div class="crazy-warehouse-container bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-xl p-4 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-125 hover:-rotate-12 border-2 border-cyan-300">
        <BuildingStorefrontIcon class="h-8 w-8 text-white drop-shadow-lg animate-wiggle-reverse" />
        <div class="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-ping animation-delay-500"></div>
        <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-300"></div>
      </div>
    </div>

    <!-- Multiple trucks for epic sequence -->
    <div
      v-for="(truck, index) in additionalTrucks"
      :key="`extra-truck-${index}`"
      class="absolute cursor-pointer z-40"
      :class="`truck-convoy-${index}`"
      :style="truck.style"
    >
      <div class="crazy-truck-container bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-lg p-2 shadow-xl border border-yellow-300">
        <TruckIcon class="h-4 w-4 text-white drop-shadow-lg" />
      </div>
    </div>

    <!-- Confetti containers -->
    <div ref="confettiContainer" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import {
  TruckIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

// CRAZY animation states
const truckCrazy = ref(false)
const warehouseCrazy = ref(false)
const truckElement = ref(null)
const warehouseElement = ref(null)
const confettiContainer = ref(null)

// Epic animation sequence states
const epicSequenceActive = ref(false)
const truckRiding = ref(false)
const warehouseGrowing = ref(false)
const truckSwallowed = ref(false)
const confettiExploding = ref(false)
const additionalTrucks = ref([])
const warehouseScale = ref(1)
const trucksSwallowed = ref(0)

// CONFETTI MADNESS FUNCTIONS 🎉
const createConfetti = (x, y, colors) => {
  if (!confettiContainer.value) return
  const confettiCount = 30
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 1000;
    `
    confettiContainer.value.appendChild(confetti)
    const animation = confetti.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 400}px, ${Math.random() * 300 + 200}px) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 2000 + 1500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    })
    animation.onfinish = () => confetti.remove()
  }
}

// EPIC ANIMATION SEQUENCE! 🚚➡️🏪💥🎊
const triggerEpicSequence = async () => {
  if (!process.client || epicSequenceActive.value) return
  epicSequenceActive.value = true
  warehouseScale.value = 1
  trucksSwallowed.value = 0
  additionalTrucks.value = []
  let warehousePos = { x: 0, y: 0 }
  if (warehouseElement.value) {
    const rect = warehouseElement.value.getBoundingClientRect()
    warehousePos.x = rect.left + rect.width / 2
    warehousePos.y = rect.top + rect.height / 2
  }
  setTimeout(() => {
    animateMainTruckToWarehouse(warehousePos)
  }, 200)
  const createTruckConvoy = () => {
    const truckCount = 5
    for (let i = 0; i < truckCount; i++) {
      setTimeout(() => {
        const startPositions = [
          { left: '10px', top: '30%' },
          { left: '5px', top: '50%' },
          { left: '15px', top: '70%' },
          { left: '20px', top: '25%' },
          { left: '8px', top: '60%' }
        ]
        additionalTrucks.value.push({
          id: Date.now() + i,
          style: startPositions[i],
          swallowed: false
        })
        setTimeout(() => {
          animateTruckToWarehouse(i, warehousePos)
        }, 100)
      }, i * 400)
    }
  }
  createTruckConvoy()
  setTimeout(() => {
    confettiExploding.value = true
    if (warehouseElement.value) {
      const rect = warehouseElement.value.getBoundingClientRect()
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createMassiveConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2)
        }, i * 300)
      }
    }
  }, 4000)
  setTimeout(() => {
    const shrinkDuration = 1000
    const shrinkSteps = 20
    const currentScale = warehouseScale.value
    const targetScale = 1
    const scaleStep = (currentScale - targetScale) / shrinkSteps
    let currentStep = 0
    const shrinkInterval = setInterval(() => {
      currentStep++
      warehouseScale.value = Math.max(targetScale, currentScale - (scaleStep * currentStep))
      if (currentStep >= shrinkSteps || warehouseScale.value <= targetScale) {
        clearInterval(shrinkInterval)
        warehouseScale.value = targetScale
        setTimeout(() => {
          epicSequenceActive.value = false
          truckRiding.value = false
          warehouseGrowing.value = false
          truckSwallowed.value = false
          confettiExploding.value = false
          additionalTrucks.value = []
          trucksSwallowed.value = 0
        }, 200)
      }
    }, shrinkDuration / shrinkSteps)
  }, 5500)
}

const animateMainTruckToWarehouse = (warehousePos) => {
  if (!truckElement.value) return
  const startRect = truckElement.value.getBoundingClientRect()
  const deltaX = warehousePos.x - startRect.left - 20
  const deltaY = warehousePos.y - startRect.top - 20
  truckElement.value.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  truckElement.value.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${Math.random() * 360 - 180}deg) scale(0.6)`
  setTimeout(() => {
    truckElement.value.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out'
    truckElement.value.style.opacity = '0'
    truckElement.value.style.transform += ' scale(0) rotate(720deg)'
    growWarehouse()
    setTimeout(() => {
      if (truckElement.value) {
        truckElement.value.style.transition = ''
        truckElement.value.style.transform = ''
        truckElement.value.style.opacity = '1'
      }
    }, 2000)
  }, 1500)
}

const animateTruckToWarehouse = (index, warehousePos) => {
  const truckElementDom = document.querySelector(`.truck-convoy-${index}`)
  if (!truckElementDom) return
  const startRect = truckElementDom.getBoundingClientRect()
  const deltaX = warehousePos.x - startRect.left - 20
  const deltaY = warehousePos.y - startRect.top - 20
  truckElementDom.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  truckElementDom.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${Math.random() * 360 - 180}deg) scale(0.5)`
  setTimeout(() => {
    truckElementDom.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out'
    truckElementDom.style.opacity = '0'
    truckElementDom.style.transform += ' scale(0) rotate(720deg)'
    growWarehouse()
  }, 1500)
}

const growWarehouse = () => {
  trucksSwallowed.value++
  warehouseGrowing.value = true
  const targetScale = 1 + (trucksSwallowed.value * 0.25)
  const currentScale = warehouseScale.value
  const scaleDiff = targetScale - currentScale
  const growSteps = 10
  let currentStep = 0
  const growInterval = setInterval(() => {
    currentStep++
    warehouseScale.value = currentScale + (scaleDiff * currentStep / growSteps)
    if (currentStep >= growSteps) {
      clearInterval(growInterval)
      warehouseScale.value = targetScale
      setTimeout(() => {
        const bounceScale = Math.max(1, targetScale - 0.05)
        warehouseScale.value = bounceScale
        warehouseGrowing.value = false
      }, 200)
    }
  }, 30)
}

const createMassiveConfetti = (x, y) => {
  if (!confettiContainer.value) return
  const confettiCount = 50
  const colors = ['#ff6b35','#f7931e','#ffdc00','#ff4757','#ff3838','#6c5ce7','#a29bfe','#fd79a8','#fdcb6e','#00cec9','#2ecc71','#27ae60','#e74c3c','#c0392b','#f39c12','#9b59b6','#8e44ad','#3498db','#2980b9','#1abc9c']
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${Math.random() * 12 + 6}px;
      height: ${Math.random() * 12 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 1000;
    `
    confettiContainer.value.appendChild(confetti)
    const animation = confetti.animate([
      { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 600}px, ${-Math.random() * 400 - 200}px) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 2500 + 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    })
    animation.onfinish = () => confetti.remove()
  }
}
</script>

<style scoped>
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.8s forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.8s forwards; }
.animation-delay-300 { animation-delay: .3s; }
.animation-delay-500 { animation-delay: .5s; }
.animation-delay-700 { animation-delay: .7s; }
.animation-delay-900 { animation-delay: .9s; }
.animation-delay-1100 { animation-delay: 1.1s; }
@keyframes wiggle { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
.animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }
.animate-wiggle-reverse { animation: wiggle 1.5s ease-in-out reverse infinite; }
@keyframes floatY { 0%,100% { transform: translateY(-6px); } 50% { transform: translateY(6px); } }
.floating-around { animation: floatY 4s ease-in-out infinite; }
.floating-around-reverse { animation: floatY 4s ease-in-out reverse infinite; }
</style> 