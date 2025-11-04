<script setup lang="ts">
import { ref } from 'vue'
import { ClockBackImage } from '@/assets/images'
import { withdrawService } from '@/api/withdrawService'

const amountCoins = ref<number>(0)
const targetAddress = ref<string>('')

const withdraw = async () => {
  try {
    const response = await withdrawService.withdrawCoins(+amountCoins.value, targetAddress.value)
    if (response?.success) {
      alert('Success!')
    }
  } catch (err) {
    console.log('Error while withdrawing: ', err)
    alert('Operation failed!')
  } finally {
    amountCoins.value = 0
    targetAddress.value = ''
  }
}
</script>

<template>
  <div class="bg-[#364B4B] w-full h-full pb-24 pt-8 p-4 flex flex-col gap-4">
    <h1 class="text-2xl text-white font-bold">Widthdrawal</h1>

    <div
      class="overflow-y-scroll scrollbar-hide flex flex-col gap-4"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <svg
        class="w-full shrink-0"
        viewBox="0 0 658 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 6.00092C31.0004 -6.99908 605 6.00092 638 6.00092C671 6.00092 654.5 171.002 638 181.001C621.5 191 73.5015 198.001 24 181.001C-25.5016 164.001 16.9996 19.0009 24 6.00092Z"
          fill="url(#paint0_linear_0_1)"
        />
        <ellipse cx="150" cy="95" rx="89" ry="95" fill="#727272" />
        <g filter="url(#filter0_d_0_1)">
          <path
            d="M113.174 160C147.512 160 175.348 132.796 175.348 99.2374C175.348 65.6793 147.512 38.4751 113.174 38.4751C78.8363 38.4751 51 65.6793 51 99.2374C51 132.796 78.8363 160 113.174 160Z"
            fill="#F4900C"
          />
          <path
            d="M113.174 151.525C147.512 151.525 175.348 124.32 175.348 90.7623C175.348 57.2042 147.512 30 113.174 30C78.8363 30 51 57.2042 51 90.7623C51 124.32 78.8363 151.525 113.174 151.525Z"
            fill="#FFCC4D"
          />
          <path
            d="M113.173 145.875C141.268 145.875 164.043 123.099 164.043 95.0041C164.043 66.9089 141.268 44.1333 113.173 44.1333C85.0788 44.1333 62.3037 66.9089 62.3037 95.0041C62.3037 123.099 85.0788 145.875 113.173 145.875Z"
            fill="#FFE8B6"
          />
          <path
            d="M113.173 143.047C141.268 143.047 164.043 120.271 164.043 92.176C164.043 64.0808 141.268 41.3052 113.173 41.3052C85.0788 41.3052 62.3037 64.0808 62.3037 92.176C62.3037 120.271 85.0788 143.047 113.173 143.047Z"
            fill="#FFAC33"
          />
          <path
            d="M82.0913 69.8939C82.0913 67.7831 84.0579 66.9388 84.0579 66.9388L113.017 52.6089L142.251 66.9388C142.251 66.9388 144.265 67.4113 144.265 69.9094V72.392H82.0913V69.8939Z"
            fill="#FFE8B6"
          />
          <path
            d="M141.433 76.2938C141.433 74.1378 139.633 72.3916 137.416 72.3916H88.6779C86.4572 72.3916 84.9102 74.1378 84.9102 76.2938C84.9102 77.7594 85.6374 79.022 86.7959 79.6902V82.1489H94.3313V80.196H101.867V82.1489H109.402V80.196H116.938V82.1489H124.473V80.196H132.009V82.1489H139.548V79.5905C140.678 78.8965 141.433 77.6819 141.433 76.2938ZM147.083 117.509C147.083 118.285 146.785 119.03 146.255 119.579C145.725 120.128 145.006 120.436 144.256 120.436H82.0835C81.3338 120.436 80.6149 120.128 80.0848 119.579C79.5546 119.03 79.2568 118.285 79.2568 117.509C79.2568 116.732 79.5546 115.988 80.0848 115.439C80.6149 114.89 81.3338 114.581 82.0835 114.581H144.26C145.818 114.581 147.083 115.892 147.083 117.509Z"
            fill="#F4900C"
          />
          <path
            d="M144.265 74.3174C144.264 74.8278 144.059 75.3171 143.694 75.678C143.329 76.039 142.834 76.2422 142.317 76.2431H83.9232C83.4273 76.213 82.9616 75.997 82.6212 75.6391C82.2808 75.2813 82.0913 74.8086 82.0913 74.3174C82.0913 73.8262 82.2808 73.3535 82.6212 72.9956C82.9616 72.6378 83.4273 72.4218 83.9232 72.3916L142.317 72.4025C142.572 72.4016 142.825 72.4504 143.061 72.5461C143.297 72.6419 143.512 72.7827 143.693 72.9606C143.874 73.1384 144.018 73.3498 144.116 73.5826C144.214 73.8154 144.265 74.0651 144.265 74.3174ZM91.7118 76.5526H134.536V80.8701H91.7118V76.5526Z"
            fill="#F4900C"
          />
          <path
            d="M95.4151 105.297C95.4151 107.416 94.2687 109.132 92.8574 109.132H90.2998C88.8886 109.132 87.7422 107.416 87.7422 105.297V76.2259C87.7422 74.1074 88.8886 72.3916 90.2998 72.3916H92.8574C94.2687 72.3916 95.4151 74.1074 95.4151 76.2259V105.297ZM141.438 105.297C141.438 107.416 140.295 109.132 138.88 109.132H136.323C134.911 109.132 133.765 107.416 133.765 105.297V76.2259C133.765 74.1074 134.908 72.3916 136.323 72.3916H138.88C140.292 72.3916 141.438 74.1074 141.438 76.2259V105.297ZM110.757 105.297C110.757 107.416 109.611 109.132 108.2 109.132H105.642C104.231 109.132 103.084 107.416 103.084 105.297V76.2259C103.084 74.1074 104.231 72.3916 105.642 72.3916H108.2C109.611 72.3916 110.757 74.1074 110.757 76.2259V105.297ZM126.096 105.297C126.096 107.416 124.949 109.132 123.538 109.132H120.984C119.573 109.132 118.427 107.416 118.427 105.297V76.2259C118.427 74.1074 119.573 72.3916 120.984 72.3916H123.538C124.949 72.3916 126.096 74.1074 126.096 76.2259V105.297Z"
            fill="#FFD983"
          />
          <path
            d="M141.432 107.721C141.432 110.063 139.746 111.96 137.664 111.96H88.6773C87.6781 111.96 86.7198 111.513 86.0132 110.718C85.3066 109.923 84.9097 108.845 84.9097 107.721C84.9097 106.596 85.3066 105.518 86.0132 104.723C86.7198 103.928 87.6781 103.481 88.6773 103.481H137.664C139.742 103.481 141.432 105.378 141.432 107.721Z"
            fill="#FFCC4D"
          />
          <path
            d="M147.091 110.544C147.091 112.887 145.381 114.784 143.269 114.784H85.9142C84.9003 114.784 83.9279 114.337 83.211 113.542C82.4941 112.747 82.0913 111.669 82.0913 110.544C82.0913 109.42 82.4941 108.342 83.211 107.547C83.9279 106.752 84.9003 106.305 85.9142 106.305H143.265C145.377 106.305 147.091 108.202 147.091 110.544Z"
            fill="#FFD983"
          />
          <path
            d="M154.154 115.251C154.154 116.126 153.807 116.965 153.188 117.584C152.569 118.203 151.73 118.551 150.855 118.551H78.2852C77.8519 118.551 77.4229 118.465 77.0226 118.299C76.6223 118.134 76.2585 117.891 75.9522 117.584C75.6458 117.278 75.4028 116.914 75.2369 116.514C75.0711 116.113 74.9858 115.684 74.9858 115.251C74.9858 114.818 75.0711 114.389 75.2369 113.988C75.4028 113.588 75.6458 113.224 75.9522 112.918C76.2585 112.612 76.6223 112.369 77.0226 112.203C77.4229 112.037 77.8519 111.952 78.2852 111.952H150.859C152.677 111.952 154.154 113.429 154.154 115.251Z"
            fill="#FFD983"
          />
          <path
            d="M141.432 74.0913C141.432 71.5934 139.631 69.5703 137.414 69.5703H88.6773C86.4566 69.5703 84.9097 71.5934 84.9097 74.0913C84.9097 75.7894 85.6368 77.2522 86.7953 78.0263V80.8749H94.3306V78.6123H101.866V80.8749H109.401V78.6123H116.936V80.8749H124.472V78.6123H132.007V80.8749H139.546V77.9108C140.676 77.1067 141.432 75.6995 141.432 74.0913Z"
            fill="#FFCC4D"
          />
          <path
            d="M82.0913 71.3411C82.0913 69.3988 84.0579 68.6219 84.0579 68.6219L113.017 55.4355L142.251 68.6219C142.251 68.6219 144.265 69.0567 144.265 71.3554V72.3925H82.0913V71.3411Z"
            fill="#FFD983"
          />
          <path
            d="M113.169 61.0879C113.169 61.0879 93.7262 69.6011 91.7873 70.3693C89.8447 71.1342 90.4934 72.3925 91.7908 72.3925H134.455C136.458 72.3925 135.984 70.972 134.394 70.2038C132.805 69.4389 113.169 61.0879 113.169 61.0879Z"
            fill="#FFAC33"
          />
          <path
            d="M144.265 72.3965C144.264 73.1456 144.059 73.8636 143.694 74.3933C143.329 74.923 142.834 75.2212 142.317 75.2226H83.9232C83.4273 75.1784 82.9616 74.8613 82.6212 74.3362C82.2808 73.8111 82.0913 73.1173 82.0913 72.3965C82.0913 71.6756 82.2808 70.9819 82.6212 70.4567C82.9616 69.9316 83.4273 69.6146 83.9232 69.5703L142.317 69.5863C142.572 69.5849 142.825 69.6565 143.061 69.7971C143.297 69.9376 143.512 70.1443 143.693 70.4053C143.874 70.6663 144.018 70.9765 144.116 71.3182C144.214 71.6599 144.265 72.0263 144.265 72.3965Z"
            fill="#FFD983"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_0_1"
            x="51"
            y="30"
            width="124.348"
            height="132"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
          </filter>
          <linearGradient
            id="paint0_linear_0_1"
            x1="0.359375"
            y1="95.7568"
            x2="657.053"
            y2="95.7568"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.240385" stop-color="#737373" />
            <stop offset="0.240485" stop-color="#D9D9D9" />
          </linearGradient>
        </defs>
        <text x="65%" y="40%" text-anchor="middle" font-size="36" font-weight="bold" fill="#000000">
          Your coin balance:
        </text>

        <text x="65%" y="70%" text-anchor="middle" font-size="48" font-weight="bold" fill="#000000">
          0.00
        </text>
      </svg>

      <div class="p-4 flex flex-col gap-4 bg-[#475a5a] rounded-md">
        <ul class="p-2 px-3 bg-[#d9d9d9] rounded-lg font-medium text-xs">
          <!-- <li>Withdrawal limits at your level: <strong>0</strong></li> -->
          <li>Minimum withdrawal amount (coins) - <strong>55000</strong></li>
          <li>Maximum number of requests at your level - <strong>10</strong></li>
        </ul>

        <div class="p-2 px-3 bg-[#d9d9d9] rounded-lg font-semibold text-lg text-center">
          Coin rate: 220000 coins = 1 TON
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="withdraw">
          <div
            class="p-2 px-3 bg-[#d9d9d9] rounded-lg font-semibold text-xs flex items-center gap-2 justify-between"
          >
            <p>Enter the amount of coins:</p>
            <input
              class="w-1/3 outline-none border-b"
              type="number"
              placeholder="0.00"
              required
              v-model="amountCoins"
            />
          </div>

          <div
            class="p-2 px-3 bg-[#d9d9d9] rounded-lg font-semibold text-xs flex items-center gap-2 justify-between"
          >
            <p>Enter the TON address:</p>
            <input
              class="w-1/3 outline-none border-b"
              type="text"
              placeholder="UQA..."
              required
              v-model="targetAddress"
            />
          </div>

          <div class="text-white flex justify-between items-center text-xs gap-2 mt-2">
            <p>Blockchain fee: 0.05 TON</p>
            <p>You will receive: 0.1 TON</p>
          </div>

          <button
            type="submit"
            class="w-full p-2 px-3 bg-[#FAC587] cursor-pointer font-semibold text-lg rounded-lg"
          >
            Withdraw
          </button>

          <RouterLink to="/widthdraw-history" class="flex justify-center items-center">
            <img :src="ClockBackImage" class="w-6" alt="" />
            <p class="text-white text-xs font-semibold">Transaction History</p>
          </RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
