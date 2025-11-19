<template>
  <div class="bg-cbre_primary_3 w-full h-screen overflow-hidden min-w-[360px]">
    <div class="container_wrapper">
      <div class="bg-slider">
        <div class="bg-slider-cover"></div>
        <div class="bg-image-01"></div>
        <div class="bg-image-02"></div>
        <div class="bg-image-03"></div>
        <div class="bg-image-04"></div>
      </div>
      <div class="bg-footer"></div>
    </div>
    <div class="login-form-wrapper">
      <slot />
    </div>
  </div>
</template>

<style>
.container_wrapper {
  position: absolute;
  width: 100% !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
}


.bg-slider {
  position: relative;
  overflow: hidden;
  width: 100% !important;
  height: 65%;
  min-height: 700px;
  /* background-color: blue; */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.bg-slider-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #435254;
  opacity: 0.25;
  z-index: 20;

}

.bg-image-01 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/global-mid-year-outlook.jpg');
  background-size: cover;

  -webkit-animation: fade 16s forwards infinite;
  -webkit-animation-delay: 0s;
  animation: fade 16s forwards infinite;
  animation-delay: 0s;
  opacity: 0;
}

.bg-image-02 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/zero_ph2_dataviz_homepage_2736x1824px_1110.jpg');
  background-size: cover;
  -webkit-animation: fade 16s forwards infinite;
  -webkit-animation-delay: 4s;
  animation: fade 16s forwards infinite;
  animation-delay: 4s;
  opacity: 0;
}


.bg-image-03 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/cr_carousel_2736x1824_brighter_2.jpg');
  background-size: cover;
  -webkit-animation: fade 16s forwards infinite;
  -webkit-animation-delay: 8s;
  animation: fade 16s forwards infinite;
  animation-delay: 8s;
  opacity: 0;
}


.bg-image-04 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/background/tech-talent-2023.jpg');
  background-size: cover;
  -webkit-animation: fade 16s forwards infinite;
  -webkit-animation-delay: 12s;
  animation: fade 16s forwards infinite;
  animation-delay: 12s;
  opacity: 0;
}

@-webkit-keyframes fade {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  40% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  40% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.login-form-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
</style>