import Drop from '../assets/drop'

const Fancybox = ({ data, children }) => (
  <div class="border overflow-hidden p-2">
    <img src={data.image} />
    <div class="py-2">
      <p class="text-sm font-bold">{data.name}</p>
      <div class="overflow-hidden">
        <p class="text-gray-400 text-xs">{data.description}</p>
      </div>
      <p class="text-xs mt-2">Price</p>
      <p class="text-sm font-bold text-white flex items-center">
        <Drop class="inline-block mr-2" />
        {data.price} ETH
      </p>
    </div>

    {children}
  </div>
)

export default Fancybox
